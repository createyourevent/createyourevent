import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { PriceType } from "app/entities/enumerations/price-type.model";
import { EventProductOrder, IEventProductOrder } from "app/entities/event-product-order/event-product-order.model";
import { EventProductOrderService } from "app/entities/event-product-order/service/event-product-order.service";
import { IEvent } from "app/entities/event/event.model";
import { EventService } from "app/entities/event/service/event.service";
import { IProduct } from "app/entities/product/product.model";
import { ProductService } from "app/entities/product/service/product.service";
import { IUser } from "app/entities/user/user.model";
import { GeneralService } from "app/general.service";
import { MessageService } from "primeng/api";
import * as dayjs from "dayjs";
import { IShop } from "app/entities/shop/shop.model";
import { ProductType } from "app/entities/enumerations/product-type.model";
import { CurrencyPipe } from "@angular/common";
import { DeliveryType } from "app/entities/delivery-type/delivery-type.model";
import { DeliveryTypeService } from "app/entities/delivery-type/service/delivery-type.service";
import { RentStatus } from "app/entities/enumerations/rent-status.model";
import { RentType } from "app/entities/enumerations/rent-type.model";
import { ShopService } from "app/entities/shop/service/shop.service";
import { GoogleGeocodeService } from "app/google-geocode.service";
import { RentCalendarComponent } from "app/organisator/create-event/rent-calendar.component";
import { SharedEventService } from "app/organisator/create-event/shared-event.service";
import { OrganisatorService } from "app/organisator/organisator.service";
import { DialogService } from "primeng/dynamicdialog";
import { EventService as EventUserService } from "app/views/event/event.service";
import { DeliveryTypes } from "app/entities/enumerations/delivery-types.model";
import { IEventServiceMapOrder } from "app/entities/event-service-map-order/event-service-map-order.model";


@Component({
  selector: 'jhi-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
  providers: [MessageService, CurrencyPipe, DialogService]
})
export class AddProductComponent implements OnInit {

  jhiEvent!: IEvent;
  products!: IProduct[];
  rowGroupMetadata: any;
  amountToAdd!: number;
  user!: IUser;
  searchText = '';

  isSaving = false;
  isAdding = false;
  isRemoving = false;

  selectedProducts: IProduct[] = [];

  totalCosts = 0;
  revenue = 0;
  investment = 0;
  totalLocationCosts = 0;

  shopsRealEstate!: IShop[];
  shopsFood!: IShop[];
  shopsDrink!: IShop[];
  shopsMusic!: IShop[];
  shopsLightshow!: IShop[];
  shopsDecoration!: IShop[];
  shopsMiscellaneous!: IShop[];

  productsRealEstate: IProduct[] = [];
  productsFood: IProduct[] = [];
  productsDrink: IProduct[] = [];
  productsMusic: IProduct[] = [];
  productsLightshow: IProduct[] = [];
  productsDecoration: IProduct[] = [];
  productsMiscellaneous: IProduct[] = [];

  searchTextRealEstate = '';
  searchTextFood = '';
  searchTextDrink = '';
  searchTextMusic = '';
  searchTextLightshow = '';
  searchTextDecoration = '';
  searchTextMiscellaneous = '';

  distanceSlider = 0;
  posEvent!: google.maps.LatLng;

  eventProductOrders: IEventProductOrder[];
  eventServiceMapOrders: IEventServiceMapOrder[];

  displayDialog = false;

  public totalProducts = 0;
  public totalServices = 0;
  public totalRideCosts = 0;
  public totalCart = 0;
  public totalShipping = 0;
  public totalDeliveryCosts = 0;
  public totalDeliveryRideCosts = 0;

  constructor(private generalService: GeneralService,
              private eventOrderProductService: EventProductOrderService,
              private route: ActivatedRoute,
              private jhiEventService: EventService,
              private messageService: MessageService,
              private productService: ProductService,
              private translate: TranslateService,
              private router: Router,

              protected shopService: ShopService,
              protected eventService: EventService,
              public sharedEventService: SharedEventService,
              protected organisatorService: OrganisatorService,
              private eventUserService: EventUserService,
              private eventProductOrderService: EventProductOrderService,
              private googleGeocoderService: GoogleGeocodeService,
              private deliveryTypeService: DeliveryTypeService,
              private currencyPipe: CurrencyPipe,
              public dialogService: DialogService) { }

  ngOnInit(): void {

    this.generalService.findWidthAuthorities().subscribe(u => {
      this.user = u.body!;
      const eventId = this.route.snapshot.params['eventId'];
      this.jhiEventService.find(eventId).subscribe(ev => {
        this.jhiEvent = ev.body!;

        this.generalService.findOrganizationReservationsByEventId(this.jhiEvent.id).subscribe(res => {
          res.body.forEach(ele => {
            this.totalLocationCosts += ele.total;
          });
        });

        this.generalService.findEventProductOrdersByEventId(this.jhiEvent.id).subscribe(ev => {
          this.eventProductOrders = ev.body;
          this.spliceProducts();
          this.calcRevenue();
          this.getInvestment();
          this.calcProducts();
          this.calcTotalCosts();
          this.calcShipping();
          this.calcDeliveryCosts();
          this.calcTotalInCart();
        });

        this.generalService.getAllEventServiceMapsOrdersByEventId(this.jhiEvent.id).subscribe(res => {
          this.eventServiceMapOrders = res.body;
          this.eventServiceMapOrders.forEach(order => {
            this.totalServices += order.total;
          });
        })

    const addressEvent = this.jhiEvent.location.address.address;
    let latEvent = 0;
    let lngEvent = 0;

    const queryParamEvent = addressEvent.replace(' ', '+');
    this.googleGeocoderService.getFromAddress(queryParamEvent).subscribe((resShop: any) => {
      const geocoderShop = resShop.body!['results'];
      const geometryShop = geocoderShop[0].geometry;
      latEvent = geometryShop.location.lat;
      lngEvent = geometryShop.location.lng;
      this.posEvent = new google.maps.LatLng(latEvent, lngEvent);

      this.loadShopsProductsRealEstate();
      this.loadShopsProductsFood();
      this.loadShopsProductsDrink();
      this.loadShopsProductsMusic();
      this.loadShopsProductsLightshow();
      this.loadShopsProductsDecoration();
      this.loadShopsProductsMiscellaneous();
    });




        this.generalService.findAllProductsWhereShopActiveAndProductActive().subscribe(res => {
          const prods = res.body!;
          this.generalService.findEventProductOrdersByEventId(this.jhiEvent.id!).subscribe(epos => {
            const eventProductOrders = epos.body!;
            const epop: IProduct[] = [];
            eventProductOrders.forEach(element => {
              epop.push(element.product!);
            });
            const sasas = epop.map((io) => io.id);
            this.products = prods.filter(e => sasas.indexOf(e.id) === -1)
          });
        });
      });
    });
  }

  onSort(): void {
    this.updateRowGroupMetaData(this.products);
  }

  updateRowGroupMetaData(products: IProduct[]): void {
    this.rowGroupMetadata = {};

    if (products) {
        for (let i = 0; i < products.length; i++) {
            const rowData = products[i];
            const productType = rowData.productType;

            if (i === 0) {
                this.rowGroupMetadata[productType!] = { index: 0, size: 1 };
            }
            else {
                const previousRowData = products[i - 1];
                const previousRowGroup = previousRowData.shop!.productType;
                if (productType === previousRowGroup)
                    this.rowGroupMetadata[productType!].size++;
                else
                    this.rowGroupMetadata[productType!] = { index: i, size: 1 };
            }
        }
    }
  }

  addProduct(product: IProduct): void {
    this.displayDialog = true;
    const eventId = this.route.snapshot.params['eventId'];
    this.jhiEventService.find(eventId).subscribe(e => {
      const input = <HTMLInputElement> document.getElementById('quantity-product-' + product.id);
      const amount = Number(input.value);

      if(product.priceType === PriceType.SELL && product.stock! >= 0) {
        if(product.stock! - amount >= 0) {
          product.stock! -= amount;
          this.productService.update(product).subscribe(() => {
            const eventProductOrder = new EventProductOrder();
            eventProductOrder.amount = amount;
            eventProductOrder.product = product;
            eventProductOrder.event = e.body;
            eventProductOrder.user = this.user;
            eventProductOrder.date = dayjs();
            eventProductOrder.shop = product.shop;
            eventProductOrder.event = this.jhiEvent;
            eventProductOrder.total = amount * product.price!;
            this.generalService.findEventProductOrdersByEventId(this.jhiEvent.id!).subscribe(epos => {
              const eventProductOrders = epos.body;
              const found = eventProductOrders!.find(epo => epo.id === product.id);
              if(found) {
                found.amount! += amount;
                this.eventOrderProductService.update(found).subscribe(() => {
                  this.productService.update(product).subscribe(() => {
                    this.displayDialog = false;
                    this.router.navigate(['/events/' + this.jhiEvent.id + '/edit-products']);
                  });
                });
              } else {
                this.eventOrderProductService.create(eventProductOrder).subscribe(() => {
                  this.productService.update(product).subscribe(() => {
                    this.displayDialog = false;
                    this.router.navigate(['/events/' + this.jhiEvent.id + '/edit-products']);
                  });
                });
              }
            });
          });
        } else {
          this.messageService.add({ key: 'myKey1', severity: 'error', summary: this.translate.instant('select-products.error'), detail: this.translate.instant('select-products.not-enought-quantity') });
          this.displayDialog = false;
          return;
        }

      } else if(product.priceType === PriceType.SELL && product.stock! < 0) {
        const eventProductOrder = new EventProductOrder();
        eventProductOrder.amount = amount;
        eventProductOrder.product = product;
        eventProductOrder.event = e.body;
        eventProductOrder.user = this.user;
        eventProductOrder.date = dayjs();
        eventProductOrder.shop = product.shop;
        eventProductOrder.event = this.jhiEvent;
        eventProductOrder.total = amount * product.price!;
        this.generalService.findEventProductOrdersByEventId(this.jhiEvent.id!).subscribe(epos => {
          const eventProductOrders = epos.body;
          const found = eventProductOrders!.find(epo => epo.id === product.id);
          if(found) {
            found.amount! += amount;
            this.eventOrderProductService.update(found).subscribe(() => {
              this.productService.update(product).subscribe(() => {
                this.displayDialog = false;
                this.router.navigate(['/events/' + this.jhiEvent.id + '/edit-products']);
              });
            });
          } else {
            this.eventOrderProductService.create(eventProductOrder).subscribe(() => {
              this.productService.update(product).subscribe(() => {
                this.displayDialog = false;
                this.router.navigate(['/events/' + this.jhiEvent.id + '/edit-products']);
              });
            });
          }
        });
      }



      if(product.priceType === PriceType.RENT) {
        const dateFromField = document.getElementById('field_dateStart-' + product.id) as HTMLInputElement;
        const dateUntilField = document.getElementById('field_dateEnd-' + product.id) as HTMLInputElement;
        const timeFromField = document.getElementById('field_timeStart-' + product.id) as HTMLInputElement;
        const timeUntilField = document.getElementById('field_timeEnd-' + product.id) as HTMLInputElement;

        const dateFrom = dayjs(dateFromField.value + ' ' + timeFromField.value);
        const dateUntil = dayjs(dateUntilField.value + ' ' + timeUntilField.value);

        if (!dateFrom.isValid() || !dateUntil.isValid()) {
          this.messageService.add({ key: 'myKey1', severity: 'error', summary: this.translate.instant('select-products.error'), detail: this.translate.instant('select-products.error-date') });
          this.displayDialog = false;
          return;
        }

        let arr1: IEventProductOrder[] = [];
        let arr2: IEventProductOrder[] = [];
        let arr3: IEventProductOrder[] = [];
        let arr4: IEventProductOrder[] = [];
        this.generalService.findAllEventProductOrdersWithDateFromRange(dateFrom, dateUntil).subscribe(epo1 => {
          arr1 = epo1.body!;
          this.generalService.findAllEventProductOrdersWithDateFromSmallerThenAndDateUntilBetween(dateFrom, dateUntil).subscribe(epo2 => {
            arr2 = epo2.body!;
            this.generalService.findAllEventProductOrdersWithDateFromBetweenAndDateUntilBiggerThen(dateFrom, dateUntil).subscribe(epo3 => {
              arr3 = epo3.body!;
              this.generalService.findAllEventProductOrdersWithDateFromSmallerThenAndDateUntilBiggerThenAndOnSameTimeRange(dateFrom, dateUntil).subscribe(epo4 => {
                arr4 = epo4.body!;

                const arrFinal = arr1.concat(arr2).concat(arr3).concat(arr4);
                const arrUnique = this.getUniqueListBy(arrFinal, 'id');

                let t = 0;
                arrUnique.forEach(element => {
                  t += element.amount!;
                });

                if(product.stock! - t - amount <= 0 && product.stock !== -1) {
                  this.messageService.add({ key: 'myKey1', severity: 'error', summary: this.translate.instant('edit-products.error'), detail: this.translate.instant('edit-products.not-enought-quantity-in-time') });
                  return;
                } else {
                  const eventProductOrder = new EventProductOrder();
                  eventProductOrder.amount = amount;
                  eventProductOrder.product = product;
                  eventProductOrder.event = e.body;
                  eventProductOrder.user = this.user;
                  eventProductOrder.date = dayjs();
                  eventProductOrder.shop = product.shop;
                  eventProductOrder.total = amount * product.price!;
                  eventProductOrder.dateFrom = dateFrom;
                  eventProductOrder.dateUntil = dateUntil;
                  this.generalService.findEventProductOrdersByEventId(this.jhiEvent.id!).subscribe(epos => {
                    const eventProductOrders = epos.body;
                    const found = eventProductOrders!.find(epo => epo.product!.id === product.id);
                    if(found) {
                      found.amount! += amount;
                      this.eventOrderProductService.update(found).subscribe();
                    } else {
                      this.eventOrderProductService.create(eventProductOrder).subscribe();
                    }
                    this.productService.update(product).subscribe();
                    this.previousState();
                  });
                }
              });
            });
          });
        });
      }
    });
  }



setDeliveryValues(e: any, productId: number) {
  const val = e;
  const id = val.substring(val.indexOf('---') + 3);
  const element_minimum = document.getElementById('minimum-' + productId);
  const element_price = document.getElementById('price-' + productId);
  this.deliveryTypeService.find(Number(id)).subscribe(res => {
    const ppt = res.body;
    element_minimum!.innerHTML = '' + ppt!.minimumOrderQuantity + ' ' + this.translate.instant('select-products.units');
    if (ppt!.price === null) {
      element_price!.innerHTML = '' + this.translate.instant('select-products.free');
    } else {
      element_price!.innerHTML = '' + this.currencyPipe.transform(ppt!.price);
    }
  });
}

loadShopsProductsRealEstate(): void {
  this.shopsRealEstate = [];
  this.productsRealEstate = [];
  // const shopsRealEstateInDistance: IShop[] = [];

  this.organisatorService.queryShopsWithProductTypeAndActive(ProductType.REAL_ESTATE).subscribe(res => {
    this.shopsRealEstate = res.body!;
    this.shopsRealEstate.forEach(shop => {
      let latShop = 0;
      let lngShop = 0;
      let posShop: google.maps.LatLng;
      const queryParamShop = shop.address!.replace(' ', '+');
      this.googleGeocoderService.getFromAddress(queryParamShop).subscribe((resShop: any) => {
        const geocoderShop = resShop.body!['results'];
        const geometryShop = geocoderShop[0].geometry;
        latShop = geometryShop.location.lat;
        lngShop = geometryShop.location.lng;
        posShop = new google.maps.LatLng(latShop, lngShop);

        const distEventShop = google.maps.geometry.spherical.computeDistanceBetween(this.posEvent, posShop);

        if (this.distanceSlider === 0 || distEventShop < this.distanceSlider * 1000) {
          shop.products = [];
          this.organisatorService.queryProductsWithShopIdAndActive(shop.id!).subscribe(result => {
            result.body!.forEach(product => {
              this.generalService.findDeliveryTypeByProductId(product.id).subscribe(ppt => {
                product.deliveryTypes = ppt.body;
              });
              this.productsRealEstate.push(product);
            });
            this.spliceProducts();
          });
        }
      });
    });
  });
}

loadShopsProductsFood(): void {
  this.shopsFood = [];
  this.productsFood = [];

  this.organisatorService.queryShopsWithProductTypeAndActive(ProductType.FOOD).subscribe(res => {
    this.shopsFood = res.body!;
    this.shopsFood.forEach(shop => {
      let latShop = 0;
      let lngShop = 0;
      let posShop: google.maps.LatLng;
      const queryParamShop = shop.address!.replace(' ', '+');
      this.googleGeocoderService.getFromAddress(queryParamShop).subscribe((resShop: any) => {
        const geocoderShop = resShop.body!['results'];
        const geometryShop = geocoderShop[0].geometry;
        latShop = geometryShop.location.lat;
        lngShop = geometryShop.location.lng;
        posShop = new google.maps.LatLng(latShop, lngShop);

        const distEventShop = google.maps.geometry.spherical.computeDistanceBetween(this.posEvent, posShop);

        if (this.distanceSlider === 0 || distEventShop < this.distanceSlider * 1000) {
          shop.products = [];
          this.organisatorService.queryProductsWithShopIdAndActive(shop.id!).subscribe(result => {
            result.body!.forEach(product => {
              this.generalService.findDeliveryTypeByProductId(product.id).subscribe(ppt => {
                product.deliveryTypes = ppt.body;
              });
              this.productsFood.push(product);
            });
            this.spliceProducts();
          });
        }
      });
    });
  });
}

loadShopsProductsDrink(): void {
  this.shopsDrink = [];
  this.productsDrink = [];

  this.organisatorService.queryShopsWithProductTypeAndActive(ProductType.DRINK).subscribe(res => {
    this.shopsDrink = res.body!;
    this.shopsDrink.forEach(shop => {
      let latShop = 0;
      let lngShop = 0;
      let posShop: google.maps.LatLng;
      const queryParamShop = shop.address!.replace(' ', '+');
      this.googleGeocoderService.getFromAddress(queryParamShop).subscribe((resShop: any) => {
        const geocoderShop = resShop.body!['results'];
        const geometryShop = geocoderShop[0].geometry;
        latShop = geometryShop.location.lat;
        lngShop = geometryShop.location.lng;
        posShop = new google.maps.LatLng(latShop, lngShop);

        const distEventShop = google.maps.geometry.spherical.computeDistanceBetween(this.posEvent, posShop);

        if (this.distanceSlider === 0 || distEventShop < this.distanceSlider * 1000) {
          shop.products = [];
          this.organisatorService.queryProductsWithShopIdAndActive(shop.id!).subscribe(result => {
            result.body!.forEach(product => {
              this.generalService.findDeliveryTypeByProductId(product.id).subscribe(ppt => {
                product.deliveryTypes = ppt.body;
              });
              this.productsDrink.push(product);
            });
            this.spliceProducts();
          });
        }
      });
    });
  });
}

loadShopsProductsMusic(): void {
  this.shopsMusic = [];
  this.productsMusic = [];

  this.organisatorService.queryShopsWithProductTypeAndActive(ProductType.MUSIC).subscribe(res => {
    this.shopsMusic = res.body!;
    this.shopsMusic.forEach(shop => {
      let latShop = 0;
      let lngShop = 0;
      let posShop: google.maps.LatLng;
      const queryParamShop = shop.address!.replace(' ', '+');
      this.googleGeocoderService.getFromAddress(queryParamShop).subscribe((resShop: any) => {
        const geocoderShop = resShop.body!['results'];
        const geometryShop = geocoderShop[0].geometry;
        latShop = geometryShop.location.lat;
        lngShop = geometryShop.location.lng;
        posShop = new google.maps.LatLng(latShop, lngShop);

        const distEventShop = google.maps.geometry.spherical.computeDistanceBetween(this.posEvent, posShop);

        if (this.distanceSlider === 0 || distEventShop < this.distanceSlider * 1000) {
          shop.products = [];
          this.organisatorService.queryProductsWithShopIdAndActive(shop.id!).subscribe(result => {
            result.body!.forEach(product => {
              this.generalService.findDeliveryTypeByProductId(product.id).subscribe(ppt => {
                product.deliveryTypes = ppt.body;
              });
              this.productsMusic.push(product);
            });
            this.spliceProducts();
          });
        }
      });
    });
  });
}

loadShopsProductsLightshow(): void {
  this.shopsLightshow = [];
  this.productsLightshow = [];

  this.organisatorService.queryShopsWithProductTypeAndActive(ProductType.LIGHTSHOW).subscribe(res => {
    this.shopsLightshow = res.body!;
    this.shopsLightshow.forEach(shop => {
      let latShop = 0;
      let lngShop = 0;
      let posShop: google.maps.LatLng;
      const queryParamShop = shop.address!.replace(' ', '+');
      this.googleGeocoderService.getFromAddress(queryParamShop).subscribe((resShop: any) => {
        const geocoderShop = resShop.body!['results'];
        const geometryShop = geocoderShop[0].geometry;
        latShop = geometryShop.location.lat;
        lngShop = geometryShop.location.lng;
        posShop = new google.maps.LatLng(latShop, lngShop);

        const distEventShop = google.maps.geometry.spherical.computeDistanceBetween(this.posEvent, posShop);

        if (this.distanceSlider === 0 || distEventShop < this.distanceSlider * 1000) {
          shop.products = [];
          this.organisatorService.queryProductsWithShopIdAndActive(shop.id!).subscribe(result => {
            result.body!.forEach(product => {
              this.generalService.findDeliveryTypeByProductId(product.id).subscribe(ppt => {
                product.deliveryTypes = ppt.body;
              });
              this.productsLightshow.push(product);
            });
            this.spliceProducts();
          });
        }
      });
    });
  });
}

loadShopsProductsDecoration(): void {
  this.shopsDecoration = [];
  this.productsDecoration = [];

  this.organisatorService.queryShopsWithProductTypeAndActive(ProductType.DECORATION).subscribe(res => {
    this.shopsDecoration = res.body!;
    this.shopsDecoration.forEach(shop => {
      let latShop = 0;
      let lngShop = 0;
      let posShop: google.maps.LatLng;
      const queryParamShop = shop.address!.replace(' ', '+');
      this.googleGeocoderService.getFromAddress(queryParamShop).subscribe((resShop: any) => {
        const geocoderShop = resShop.body!['results'];
        const geometryShop = geocoderShop[0].geometry;
        latShop = geometryShop.location.lat;
        lngShop = geometryShop.location.lng;
        posShop = new google.maps.LatLng(latShop, lngShop);

        const distEventShop = google.maps.geometry.spherical.computeDistanceBetween(this.posEvent, posShop);

        if (this.distanceSlider === 0 || distEventShop < this.distanceSlider * 1000) {
          shop.products = [];
          this.organisatorService.queryProductsWithShopIdAndActive(shop.id!).subscribe(result => {
            result.body!.forEach(product => {
              this.generalService.findDeliveryTypeByProductId(product.id).subscribe(ppt => {
                product.deliveryTypes = ppt.body;
              });
              this.productsDecoration.push(product);
            });
            this.spliceProducts();
          });
        }
      });
    });
  });
}

loadShopsProductsMiscellaneous(): void {
  this.shopsMiscellaneous = [];
  this.productsMiscellaneous = [];

  this.organisatorService.queryShopsWithProductTypeAndActive(ProductType.MISCELLANEOUS).subscribe(res => {
    this.shopsMiscellaneous = res.body!;
    this.shopsMiscellaneous.forEach(shop => {
      let latShop = 0;
      let lngShop = 0;
      let posShop: google.maps.LatLng;
      const queryParamShop = shop.address!.replace(' ', '+');
      this.googleGeocoderService.getFromAddress(queryParamShop).subscribe((resShop: any) => {
        const geocoderShop = resShop.body!['results'];
        const geometryShop = geocoderShop[0].geometry;
        latShop = geometryShop.location.lat;
        lngShop = geometryShop.location.lng;
        posShop = new google.maps.LatLng(latShop, lngShop);

        const distEventShop = google.maps.geometry.spherical.computeDistanceBetween(this.posEvent, posShop);

        if (this.distanceSlider === 0 || distEventShop < this.distanceSlider * 1000) {
          shop.products = [];
          this.organisatorService.queryProductsWithShopIdAndActive(shop.id!).subscribe(result => {
            result.body!.forEach(product => {
              this.generalService.findDeliveryTypeByProductId(product.id).subscribe(ppt => {
                product.deliveryTypes = ppt.body;
              });
              this.productsMiscellaneous.push(product);
            });
            this.spliceProducts();
          });
        }
      });
    });
  });
}

changeSliderRadius(e: any): void {
  this.loadShopsProductsRealEstate();
  this.loadShopsProductsFood();
  this.loadShopsProductsDrink();
  this.loadShopsProductsMusic();
  this.loadShopsProductsLightshow();
  this.loadShopsProductsDecoration();
  this.loadShopsProductsMiscellaneous();
}

spliceProducts(): void {
  this.eventProductOrders.forEach(selProd => {
    switch (selProd.product!.productType) {
      case ProductType.REAL_ESTATE:
        for (let i = 0; i < this.productsRealEstate.length; i++) {
          if (selProd.product!.id === this.productsRealEstate[i].id) {
            this.productsRealEstate.splice(i, 1);
          }
        }
        break;
      case ProductType.FOOD:
        for (let i = 0; i < this.productsFood.length; i++) {
          if (selProd.product!.id === this.productsFood[i].id) {
            this.productsFood.splice(i, 1);
          }
        }
        break;
      case ProductType.DRINK:
        for (let i = 0; i < this.productsDrink.length; i++) {
          if (selProd.product!.id === this.productsDrink[i].id) {
            this.productsDrink.splice(i, 1);
          }
        }
        break;
      case ProductType.MUSIC:
        for (let i = 0; i < this.productsMusic.length; i++) {
          if (selProd.product!.id === this.productsMusic[i].id) {
            this.productsMusic.splice(i, 1);
          }
        }
        break;
      case ProductType.LIGHTSHOW:
        for (let i = 0; i < this.productsLightshow.length; i++) {
          if (selProd.product!.id === this.productsLightshow[i].id) {
            this.productsLightshow.splice(i, 1);
          }
        }
        break;
      case ProductType.DECORATION:
        for (let i = 0; i < this.productsDecoration.length; i++) {
          if (selProd.product!.id === this.productsDecoration[i].id) {
            this.productsDecoration.splice(i, 1);
          }
        }
        break;
      case ProductType.MISCELLANEOUS:
        for (let i = 0; i < this.productsMiscellaneous.length; i++) {
          if (selProd.product!.id === this.productsMiscellaneous[i].id) {
            this.productsMiscellaneous.splice(i, 1);
          }
        }
        break;
    }
  });
}

addToProductlist(productId: number): void {
  this.displayDialog = true;
  this.isAdding = true;
  this.productService.find(productId).subscribe(product => {
    const prod = product.body!;

    let user: IUser;
    this.generalService.findWidthAuthorities().subscribe(res => {
      user = res.body!;

      const eventProductOrder = new EventProductOrder();
      eventProductOrder.user = user;
      eventProductOrder.product = prod;
      const quantityField = document.getElementById('quantity-product-' + productId) as HTMLInputElement;
      const amount = Number(quantityField.value);
      eventProductOrder.amount = Number(amount);
      eventProductOrder.total = eventProductOrder.amount * prod.price!;
      eventProductOrder.product = prod;
      eventProductOrder.shop = prod.shop;
      eventProductOrder.event = this.jhiEvent;

      const deliveryType = new DeliveryType();
      const deliveryTypeField = document.getElementById('deliveryType---' + productId) as HTMLSelectElement;
      const dT = deliveryTypeField.value;
      const dTId = Number(dT.substring(dT.indexOf('---') + 3));

      if(prod.priceType === 'SELL') {
        const cspe = document.getElementById('checkSellingPrice---' + productId) as HTMLInputElement;
        const csp = cspe.checked;

        if (csp === true) {
          const sellingPriceFiled = document.getElementById('sellingPrice---' + productId) as HTMLInputElement;
          const spwoc = sellingPriceFiled.value.substring(3).replace(",", ".");
          const sellingPrice = Number(spwoc);
          if(sellingPrice === null || sellingPrice === undefined || sellingPrice === 0){
            this.isAdding = false;
            this.messageService.add({
              key: 'myKey1',
              severity: 'error',
              summary: this.translate.instant('select-products.error'),
              detail: this.translate.instant('select-products.please-add-selling-price')
            });
            this.displayDialog = false;
            return;
          }
          eventProductOrder.sellingPrice = sellingPrice;
        }
      }

      if (dT === '0') {
        this.isAdding = false;
        this.messageService.add({
          key: 'myKey1',
          severity: 'error',
          summary: this.translate.instant('select-products.error'),
          detail: this.translate.instant('select-products.please-select-delivery-method')
        });
        this.displayDialog = false;
        return;
      }


      this.deliveryTypeService.find(dTId).subscribe(dT => {
        const deliveryType = dT.body!;
        if (deliveryType.minimumOrderQuantity! > amount) {
          this.isAdding = false;
          this.messageService.add({
            key: 'myKey1',
            severity: 'error',
            summary: this.translate.instant('select-products.error'),
            detail: this.translate.instant('select-products.please-take-minimum-quantity')
          });
          this.displayDialog = false;
          return;
        }

        eventProductOrder.deliveryType = deliveryType;

        if (eventProductOrder.product!.priceType === PriceType.SELL) {
          if (prod.stock - Number(amount) < 0 && prod.stock >= 0) {
            this.isAdding = false;
            this.messageService.add({
              key: 'myKey1',
              severity: 'error',
              summary: this.translate.instant('select-products.error'),
              detail: this.translate.instant('select-products.not-enought-quantity')
            });
            this.displayDialog = false;
            return;
          }

          if (this.jhiEvent.investment + this.revenue < this.totalCosts + eventProductOrder.total) {
            this.isAdding = false;
            this.messageService.add({
              key: 'myKey1',
              severity: 'error',
              summary: this.translate.instant('select-products.error'),
              detail: this.translate.instant('select-products.not-enought-money')
            });
            this.displayDialog = false;
            return;
          }

          prod.stock! -= amount;
          if (prod.stock === 0) {
            prod.active = false;
          }
          this.productService.update(prod).subscribe(() => {
            this.eventProductOrderService.create(eventProductOrder).subscribe(epo => {
              this.eventProductOrders.push(epo.body);
              if (prod.productType === ProductType.REAL_ESTATE) {
                for (let i = 0; i < this.productsRealEstate.length; i++) {
                  if (this.productsRealEstate[i].id === productId) {
                    this.productsRealEstate.splice(i, 1);
                  }
                }
              }
              if (prod.productType === ProductType.FOOD) {
                for (let i = 0; i < this.productsFood.length; i++) {
                  if (this.productsFood[i].id === productId) {
                    this.productsFood.splice(i, 1);
                  }
                }
              }
              if (prod.productType === ProductType.DRINK) {
                for (let i = 0; i < this.productsDrink.length; i++) {
                  if (this.productsDrink[i].id === productId) {
                    this.productsDrink.splice(i, 1);
                  }
                }
              }
              if (prod.productType === ProductType.MUSIC) {
                for (let i = 0; i < this.productsMusic.length; i++) {
                  if (this.productsMusic[i].id === productId) {
                    this.productsMusic.splice(i, 1);
                  }
                }
              }
              if (prod.productType === ProductType.LIGHTSHOW) {
                for (let i = 0; i < this.productsLightshow.length; i++) {
                  if (this.productsLightshow[i].id === productId) {
                    this.productsLightshow.splice(i, 1);
                  }
                }
              }
              if (prod.productType === ProductType.DECORATION) {
                for (let i = 0; i < this.productsDecoration.length; i++) {
                  if (this.productsDecoration[i].id === productId) {
                    this.productsDecoration.splice(i, 1);
                  }
                }
              }
              if (prod.productType === ProductType.MISCELLANEOUS) {
                for (let i = 0; i < this.productsMiscellaneous.length; i++) {
                  if (this.productsMiscellaneous[i].id === productId) {
                    this.productsMiscellaneous.splice(i, 1);
                  }
                }
              }

              this.calcRevenue();
              this.getInvestment();
              this.calcProducts();
              this.calcTotalCosts();
              this.calcShipping();
              this.calcDeliveryCosts();
              this.calcTotalInCart();
              this.isAdding = false;
              this.displayDialog = false;
            });
          });

        } else if (eventProductOrder.product!.priceType === PriceType.RENT) {
          eventProductOrder.status = RentStatus.BOOKED;

          const dateFromField = document.getElementById('field_dateStart-' + eventProductOrder.product!.id) as HTMLInputElement;
          const dateUntilField = document.getElementById('field_dateEnd-' + eventProductOrder.product!.id) as HTMLInputElement;
          const timeFromField = document.getElementById('field_timeStart-' + eventProductOrder.product!.id) as HTMLInputElement;
          const timeUntilField = document.getElementById('field_timeEnd-' + eventProductOrder.product!.id) as HTMLInputElement;

          const dateFrom = dayjs(dateFromField.value + ' ' + timeFromField.value);
          const dateUntil = dayjs(dateUntilField.value + ' ' + timeUntilField.value);

          if (!dateFrom.isValid() || !dateUntil.isValid()) {
            this.isAdding = false;
            this.messageService.add({
              key: 'myKey1',
              severity: 'error',
              summary: this.translate.instant('select-products.error'),
              detail: this.translate.instant('select-products.error-date')
            });
            this.displayDialog = false;
            return;
          }

          let arr1: IEventProductOrder[] = [];
          let arr2: IEventProductOrder[] = [];
          let arr3: IEventProductOrder[] = [];
          let arr4: IEventProductOrder[] = [];
          this.generalService.findAllEventProductOrdersWithDateFromRange(dateFrom, dateUntil).subscribe(epo1 => {
            arr1 = epo1.body!;
            this.generalService
              .findAllEventProductOrdersWithDateFromSmallerThenAndDateUntilBetween(dateFrom, dateUntil)
              .subscribe(epo2 => {
                arr2 = epo2.body!;
                this.generalService
                  .findAllEventProductOrdersWithDateFromBetweenAndDateUntilBiggerThen(dateFrom, dateUntil)
                  .subscribe(epo3 => {
                    arr3 = epo3.body!;
                    this.generalService
                      .findAllEventProductOrdersWithDateFromSmallerThenAndDateUntilBiggerThenAndOnSameTimeRange(dateFrom, dateUntil)
                      .subscribe(epo4 => {
                        arr4 = epo4.body!;

                        const arrFinal = arr1
                          .concat(arr2)
                          .concat(arr3)
                          .concat(arr4);
                        const arrUnique = this.getUniqueListBy(arrFinal, 'id');

                        let t = 0;
                        arrUnique.forEach(element => {
                          t += element.amount!;
                        });

                        if (eventProductOrder.product!.stock! - t - amount < 0 && eventProductOrder.product!.stock !== -1) {
                          this.isAdding = false;
                          this.messageService.add({
                            key: 'myKey1',
                            severity: 'error',
                            summary: this.translate.instant('edit-products.error'),
                            detail: this.translate.instant('edit-products.not-enought-quantity-in-time')
                          });
                          this.displayDialog = false;
                          return;
                        }
                        eventProductOrder.amount = Number(amount);
                        eventProductOrder.dateFrom = dateFrom;
                        eventProductOrder.dateUntil = dateUntil;
                        eventProductOrder.amount = Number(amount);
                        //eventProductOrder.total = eventProductOrder.amount * prod.price!;
                        eventProductOrder.product = prod;
                        eventProductOrder.shop = prod.shop;
                        eventProductOrder.event = this.jhiEvent;
                        if (this.getInvestment() + this.calcRevenue() < this.totalCosts + eventProductOrder.total) {
                          this.isAdding = false;
                          this.messageService.add({
                            key: 'myKey1',
                            severity: 'error',
                            summary: this.translate.instant('select-products.error'),
                            detail: this.translate.instant('select-products.not-enought-money')
                          });
                          this.displayDialog = false;
                          return;
                        }

                        if (prod.priceType !== PriceType.RENT) {
                          prod.stock! -= eventProductOrder.amount;
                        } else {
                          eventProductOrder.status = RentStatus.BOOKED;
                        }

                        this.eventProductOrderService.create(eventProductOrder).subscribe(() => {
                          this.eventProductOrders.push(eventProductOrder);
                          this.spliceProducts();
                          this.calcRevenue();
                          this.getInvestment();
                          this.calcProducts();
                          this.calcTotalCosts();
                          this.calcShipping();
                          this.calcDeliveryCosts();
                          this.calcTotalInCart();

                          if (prod.productType === ProductType.REAL_ESTATE) {
                            for (let i = 0; i < this.productsRealEstate.length; i++) {
                              if (this.productsRealEstate[i].id === productId) {
                                this.productsRealEstate.splice(i, 1);
                              }
                            }
                          }
                          if (prod.productType === ProductType.FOOD) {
                            for (let i = 0; i < this.productsFood.length; i++) {
                              if (this.productsFood[i].id === productId) {
                                this.productsFood.splice(i, 1);
                              }
                            }
                          }
                          if (prod.productType === ProductType.DRINK) {
                            for (let i = 0; i < this.productsDrink.length; i++) {
                              if (this.productsDrink[i].id === productId) {
                                this.productsDrink.splice(i, 1);
                              }
                            }
                          }
                          if (prod.productType === ProductType.MUSIC) {
                            for (let i = 0; i < this.productsMusic.length; i++) {
                              if (this.productsMusic[i].id === productId) {
                                this.productsMusic.splice(i, 1);
                              }
                            }
                          }
                          if (prod.productType === ProductType.LIGHTSHOW) {
                            for (let i = 0; i < this.productsLightshow.length; i++) {
                              if (this.productsLightshow[i].id === productId) {
                                this.productsLightshow.splice(i, 1);
                              }
                            }
                          }
                          if (prod.productType === ProductType.DECORATION) {
                            for (let i = 0; i < this.productsDecoration.length; i++) {
                              if (this.productsDecoration[i].id === productId) {
                                this.productsDecoration.splice(i, 1);
                              }
                            }
                          }
                          if (prod.productType === ProductType.MISCELLANEOUS) {
                            for (let i = 0; i < this.productsMiscellaneous.length; i++) {
                              if (this.productsMiscellaneous[i].id === productId) {
                                this.productsMiscellaneous.splice(i, 1);
                              }
                            }
                          }

                          this.spliceProducts();
                          this.calcRevenue();
                          this.getInvestment();
                          this.calcProducts();
                          this.calcTotalCosts();
                          this.calcShipping();
                          this.calcDeliveryCosts();
                          this.calcTotalInCart();
                          this.isAdding = false;
                          this.displayDialog = false;
                        });
                      });
                  });
              });
          });
        }
      });
    });
  });
}

getUniqueListBy(arr: any[], key: any): IEventProductOrder[] {
  return [...new Map(arr.map(item => [item[key], item])).values()];
}

removeFromProductlist(productEventOrder: IEventProductOrder): void {
  this.isRemoving = true;
  this.displayDialog = true;
  switch (productEventOrder.product!.productType) {
    case ProductType.REAL_ESTATE:
      productEventOrder.product.stock += productEventOrder.amount;
      this.productService.partialUpdate(productEventOrder.product).subscribe(pr => {
        this.productsRealEstate.push(pr.body);
        this.eventOrderProductService.delete(productEventOrder.id).subscribe(() => {
          this.generalService.findEventProductOrdersByEventId(this.jhiEvent.id).subscribe(ev => {
            this.eventProductOrders = ev.body;
            this.spliceProducts();
            this.calcRevenue();
            this.getInvestment();
            this.calcProducts();
            this.calcTotalCosts();
            this.calcShipping();
            this.calcDeliveryCosts();
            this.calcTotalInCart();
            this.displayDialog = false;
          })
        });
      });
      break;
    case ProductType.FOOD:
      productEventOrder.product.stock += productEventOrder.amount;
      this.productService.partialUpdate(productEventOrder.product).subscribe(pr => {
        this.productsFood.push(pr.body);
        this.eventOrderProductService.delete(productEventOrder.id).subscribe(() => {
          this.generalService.findEventProductOrdersByEventId(this.jhiEvent.id).subscribe(ev => {
            this.eventProductOrders = ev.body;
            this.spliceProducts();
            this.calcRevenue();
            this.getInvestment();
            this.calcProducts();
            this.calcTotalCosts();
            this.calcShipping();
            this.calcDeliveryCosts();
            this.calcTotalInCart();
            this.displayDialog = false;
          })
        });
      });
      break;
    case ProductType.DRINK:
      productEventOrder.product.stock += productEventOrder.amount;
      this.productService.partialUpdate(productEventOrder.product).subscribe(pr => {
        this.productsDrink.push(pr.body);
        this.eventOrderProductService.delete(productEventOrder.id).subscribe(() => {
          this.generalService.findEventProductOrdersByEventId(this.jhiEvent.id).subscribe(ev => {
            this.eventProductOrders = ev.body;
            this.spliceProducts();
            this.calcRevenue();
            this.getInvestment();
            this.calcProducts();
            this.calcTotalCosts();
            this.calcShipping();
            this.calcDeliveryCosts();
            this.calcTotalInCart();
            this.displayDialog = false;
          })
        });
      });
      break;
    case ProductType.MUSIC:
      productEventOrder.product.stock += productEventOrder.amount;
      this.productService.partialUpdate(productEventOrder.product).subscribe(pr => {
        this.productsMusic.push(pr.body);
        this.eventOrderProductService.delete(productEventOrder.id).subscribe(() => {
          this.generalService.findEventProductOrdersByEventId(this.jhiEvent.id).subscribe(ev => {
            this.eventProductOrders = ev.body;
            this.spliceProducts();
            this.calcRevenue();
            this.getInvestment();
            this.calcProducts();
            this.calcTotalCosts();
            this.calcShipping();
            this.calcDeliveryCosts();
            this.calcTotalInCart();
            this.displayDialog = false;
          })
        });
      });
      break;
    case ProductType.LIGHTSHOW:
      productEventOrder.product.stock += productEventOrder.amount;
      this.productService.partialUpdate(productEventOrder.product).subscribe(pr => {
        this.productsLightshow.push(pr.body);
        this.eventOrderProductService.delete(productEventOrder.id).subscribe(() => {
          this.generalService.findEventProductOrdersByEventId(this.jhiEvent.id).subscribe(ev => {
            this.eventProductOrders = ev.body;
            this.spliceProducts();
            this.calcRevenue();
            this.getInvestment();
            this.calcProducts();
            this.calcTotalCosts();
            this.calcShipping();
            this.calcDeliveryCosts();
            this.calcTotalInCart();
            this.displayDialog = false;
          })
        });
      });
      break;
    case ProductType.DECORATION:
      productEventOrder.product.stock += productEventOrder.amount;
      this.productService.partialUpdate(productEventOrder.product).subscribe(pr => {
        this.productsDecoration.push(pr.body);
        this.eventOrderProductService.delete(productEventOrder.id).subscribe(() => {
          this.generalService.findEventProductOrdersByEventId(this.jhiEvent.id).subscribe(ev => {
            this.eventProductOrders = ev.body;
            this.spliceProducts();
            this.calcRevenue();
            this.getInvestment();
            this.calcProducts();
            this.calcTotalCosts();
            this.calcShipping();
            this.calcDeliveryCosts();
            this.calcTotalInCart();
            this.displayDialog = false;
          })
        });
      });
      break;
    case ProductType.MISCELLANEOUS:
      productEventOrder.product.stock += productEventOrder.amount;
      this.productService.partialUpdate(productEventOrder.product).subscribe(pr => {
        this.productsMiscellaneous.push(pr.body);
        this.eventOrderProductService.delete(productEventOrder.id).subscribe(() => {
          this.generalService.findEventProductOrdersByEventId(this.jhiEvent.id).subscribe(ev => {
            this.eventProductOrders = ev.body;
            this.spliceProducts();
            this.calcRevenue();
            this.getInvestment();
            this.calcProducts();
            this.calcTotalCosts();
            this.calcShipping();
            this.calcDeliveryCosts();
            this.calcTotalInCart();
            this.displayDialog = false;
          })
        });
      });
      break;
  }

  /*
  this.productService.find(producId).subscribe(product => {
    const prod = product.body!;

    this.generalService.findWidthAuthorities().subscribe(() => {
      for (let i = 0; i < this.sharedEventService.selectedEventProductOrders.length; i++) {
        if (this.sharedEventService.selectedEventProductOrders[i].product!.id === productId) {
          if (this.sharedEventService.selectedEventProductOrders[i].product!.stock! >= 0) {
            if (this.sharedEventService.selectedEventProductOrders[i].product!.priceType !== PriceType.RENT) {
              this.sharedEventService.selectedEventProductOrders[i].product!.stock! += this.sharedEventService.selectedEventProductOrders[
                i
              ].amount!;
            }
          }

          switch (this.sharedEventService.selectedEventProductOrders[i].product!.productType) {
            case ProductType.REAL_ESTATE:
              this.productsRealEstate.push(prod);
              this.generalService.findDeliveryTypeByProductId(prod.id!).subscribe(ppt => {
                prod.deliveryTypes = ppt.body;
              });
              break;
            case ProductType.FOOD:
              this.productsFood.push(prod);
              this.generalService.findDeliveryTypeByProductId(prod.id!).subscribe(ppt => {
                prod.deliveryTypes = ppt.body;
              });
              break;
            case ProductType.DRINK:
              this.productsDrink.push(prod);
              this.generalService.findDeliveryTypeByProductId(prod.id!).subscribe(ppt => {
                prod.deliveryTypes = ppt.body;
              });
              break;
            case ProductType.MUSIC:
              this.productsMusic.push(prod);
              this.generalService.findDeliveryTypeByProductId(prod.id!).subscribe(ppt => {
                prod.deliveryTypes = ppt.body;
              });
              break;
            case ProductType.LIGHTSHOW:
              this.productsLightshow.push(prod);
              this.generalService.findDeliveryTypeByProductId(prod.id!).subscribe(ppt => {
                prod.deliveryTypes = ppt.body;
              });
              break;
            case ProductType.DECORATION:
              this.productsDecoration.push(prod);
              this.generalService.findDeliveryTypeByProductId(prod.id!).subscribe(ppt => {
                prod.deliveryTypes = ppt.body;
              });
              break;
            case ProductType.MISCELLANEOUS:
              this.productsMiscellaneous.push(prod);
              this.generalService.findDeliveryTypeByProductId(prod.id!).subscribe(ppt => {
                prod.deliveryTypes = ppt.body;
              });
              break;
          }
          this.sharedEventService.selectedEventProductOrders.splice(i, 1);
        }
      }
    });
  });
  */

  this.calcRevenue();
  this.getInvestment();
  this.calcProducts();
  this.calcTotalCosts();
  this.calcShipping();
  this.calcDeliveryCosts();
  this.calcTotalInCart();
  this.isRemoving = false;
}

save(): void {
  this.isSaving = true;
  this.isSaving = false;
  this.router.navigate(['/organisator/create-event/select-services']);
}

flipCard(id: number) {
  const card = document.querySelector('.flipcard-' + id);
  card.classList.toggle('is-flipped');
}

gotoSupplier(id: number) {
  this.router.navigate(['/supplier/shop/' + id + '/overview']);
}

formatAddress(address: string): string {

  const googleAddressArray = address.split(',');
  let fa = `
  ${googleAddressArray[0]}
  ${googleAddressArray[1]}
  ${googleAddressArray[2]}`;
  return fa;
}

calcTotalCosts(): void {
  let sum = 0;

  this.eventProductOrders.forEach(eventProductOrder => {
    if (eventProductOrder.product!.priceType === PriceType.SELL) {
      sum = eventProductOrder.product!.price! * eventProductOrder.amount!;
    } else if (eventProductOrder.product!.priceType === PriceType.RENT) {
      const duration = dayjs.duration(dayjs(eventProductOrder.dateUntil!).diff(eventProductOrder.dateFrom!));
      const hours = duration.asHours();
      let factor = 0;

      if (eventProductOrder.product!.rentType === RentType.HOURLY) {
        factor = hours;
        sum = eventProductOrder.product!.price! * eventProductOrder.amount! * factor;
      } else if (eventProductOrder.product!.rentType === RentType.HALFDAY) {
        factor = hours / 12;
        if (hours < 12) {
          factor = 1;
        } else if (hours >= 12 && hours < 24) {
          factor = 2;
        } else if (hours >= 36 && hours < 48) {
          factor = 3;
        } else if (hours >= 60 && hours < 72) {
          factor = 4;
        } else if (hours >= 84 && hours < 96) {
          factor = 5;
        } else if (hours >= 96 && hours < 106) {
          factor = 6;
        } else if (hours >= 106 && hours < 118) {
          factor = 7;
        }
      } else if (eventProductOrder.product!.rentType === RentType.DAY) {
        factor = hours / 24;
        if (hours < 24) {
          factor = 1;
        } else if (hours >= 24 && hours < 48) {
          factor = 2;
        } else if (hours >= 48 && hours < 72) {
          factor = 3;
        } else if (hours >= 72 && hours < 96) {
          factor = 4;
        } else if (hours >= 96 && hours < 120) {
          factor = 5;
        } else if (hours >= 120 && hours < 144) {
          factor = 6;
        } else if (hours >= 144 && hours < 168) {
          factor = 7;
        }

        sum = eventProductOrder.product!.price! * eventProductOrder.amount! * factor;
      }
    }
    eventProductOrder.total = sum;
  });

  let all = 0;
  this.eventProductOrders.forEach(eventProductOrder => {
    all += eventProductOrder.total!;
  });

  this.totalCosts = all;
}

calcShipping(): number {
  let shippingCosts = 0;
  if (this.eventProductOrders.length === 0) {
    return -1;
  }
  this.eventProductOrders.forEach(element => {
    if (element.deliveryType!.deliveryType === DeliveryTypes.SHIPPING) {
      shippingCosts += element.deliveryType!.price!;
    }
  });
  this.totalShipping = shippingCosts;
  return this.totalShipping;
}

calcDeliveryCosts(): void {
  this.totalDeliveryCosts = 0;
  this.totalDeliveryRideCosts = 0;

  if (this.eventProductOrders.length === 0) {
    return;
  }
  let tdc = 0;
  this.eventProductOrders.forEach(element => {
    tdc += element.deliveryType!.price!;
  });
  this.totalDeliveryCosts = tdc / this.eventProductOrders.length;

  let shops: IShop[] = [];
  let rideCosts: number[] = [];

  this.eventProductOrders.forEach(element => {
    const found = shops.find(x => x.id === element.shop!.id);
    if (!found || found === undefined) {
      shops.push(element.shop!);
      const shopOrders = this.eventProductOrders.filter(x => x.shop!.id === element.shop!.id);
      let trc = 0;
      shopOrders.forEach(shopOrder => {
        trc += shopOrder.deliveryType!.pricePerKilometre!;
      });
      rideCosts.push(trc / shopOrders.length);
    }
  });


  let distances: number[];
  this.getDistancesFromShops(shops).then(ds => {
    distances = ds;
    for (let i = 0; i < shops.length; i++) {
      const shop = shops[i];
      const distance = distances[i];
      const rideCost = rideCosts[i];
      this.totalDeliveryRideCosts = (distance / 1000) * rideCost;
    }
    this.calcTotalInCart();
  });
}

getDistancesFromShops(shops: IShop[]): Promise<number[]> {
  let p = new Promise<number[]>((resolve, reject) => {
    const addressEvent = this.jhiEvent.location.address.address;
    let distances: number[] = [];
    let posEvent: google.maps.LatLng;
    let latEvent = 0;
    let lngEvent = 0;
    let latShop = 0;
    let lngShop = 0;
    let posShop: google.maps.LatLng;

    const queryParamEvent = addressEvent.replace(' ', '+');
    this.googleGeocoderService.getFromAddress(queryParamEvent).subscribe((resShop: any) => {
      const geocoderShop = resShop.body!['results'];
      const geometryShop = geocoderShop[0].geometry;
      latEvent = geometryShop.location.lat;
      lngEvent = geometryShop.location.lng;
      posEvent = new google.maps.LatLng(latEvent, lngEvent);

      shops.forEach(shop => {
        const queryParamShop = shop.address!.replace(' ', '+');
        this.googleGeocoderService.getFromAddress(queryParamShop).subscribe((resShop: any) => {
          const geocoderShop = resShop.body!['results'];
          const geometryShop = geocoderShop[0].geometry;
          latShop = geometryShop.location.lat;
          lngShop = geometryShop.location.lng;
          posShop = new google.maps.LatLng(latShop, lngShop);
          let d = google.maps.geometry.spherical.computeDistanceBetween(posEvent, posShop);
          distances.push(d);
          if (distances.length === shops.length) {
            resolve(distances);
          }
        });
      });
    });
  });
  return p;
}

calcRideCosts(): number {
  let totalRideCosts = 0;
  this.eventServiceMapOrders.forEach(element => {
    totalRideCosts += element.rideCosts!;
  });
  this.totalRideCosts = totalRideCosts;
  return this.totalRideCosts;
}

getDisabledSellingPrice(id: number): boolean {
  const cspe = document.getElementById('checkSellingPrice---' + id) as HTMLInputElement;
  return !cspe.checked;
}

rentCalendar(productId: number): void {
  const ref = this.dialogService.open(RentCalendarComponent, {
    data: {
        id: productId
    },
    header: 'Rent Calendar',
    width: '85%'
});
}

calcTotalInCart(): number {
  this.totalCart =
  this.totalLocationCosts +
  this.calcProducts() +
  this.calcServices() +
  this.calcRideCosts() +
  this.totalDeliveryCosts +
  this.totalDeliveryRideCosts +
  this.totalShipping;
return this.totalCart;
}

calcServices(): number {
  let totalServices = 0;
  this.eventServiceMapOrders.forEach(element => {
    totalServices += element.total!;
  });
  this.totalServices = totalServices;
  return this.totalServices;
}

getInvestment(): number {
  this.investment = Number(this.jhiEvent.investment);
  return this.investment;
}

calcRevenue(): number {
  this.revenue = Number(this.jhiEvent.price) * Number(this.jhiEvent.minPlacenumber);
  return this.revenue;
}

calcProducts(): number {
  let totalProducts = 0;
  this.eventProductOrders.forEach(element => {
    totalProducts += element.total!;
  });
  this.totalProducts = totalProducts;
  return this.totalProducts;
}

previousState(): void {
  this.router.navigate(['/events/' + this.jhiEvent.id + '/edit-products']);
}

onValChange(quant: string, id: string): void {
  const prodIdArr = id.split('---');
  const prodId = Number(prodIdArr[1]);

  this.productService.find(prodId).subscribe(product => {
    const prod = product.body!;
    let user: IUser;
    this.generalService.findWidthAuthorities().subscribe(u => {
      user = u.body!;

      this.eventUserService.getEventProductOrderByProductAndUser(prod.id!, user.id).subscribe(e => {
        const eventProductOrder = e.body;

        eventProductOrder!.amount = Number(quant);
        eventProductOrder!.total = Number(quant) * prod.price!;

        this.eventProductOrderService.update(eventProductOrder!).subscribe(() => {});
      });
    });
  });
}

}
