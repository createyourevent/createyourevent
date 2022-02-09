import { CurrencyPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DeliveryTypeService } from 'app/entities/delivery-type/service/delivery-type.service';
import { DeliveryTypes } from 'app/entities/enumerations/delivery-types.model';
import { PriceType } from 'app/entities/enumerations/price-type.model';
import { RentType } from 'app/entities/enumerations/rent-type.model';
import { EventProductOrder, IEventProductOrder } from 'app/entities/event-product-order/event-product-order.model';
import { EventProductOrderService } from 'app/entities/event-product-order/service/event-product-order.service';
import { IEventServiceMapOrder } from 'app/entities/event-service-map-order/event-service-map-order.model';
import { IEvent } from 'app/entities/event/event.model';
import { IProduct } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/service/product.service';
import { ShopService } from 'app/entities/shop/service/shop.service';
import { IShop } from 'app/entities/shop/shop.model';
import { GeneralService } from 'app/general.service';
import { GoogleGeocodeService } from 'app/google-geocode.service';
import { SharedEventService } from 'app/organisator/create-event/shared-event.service';
import { OrganisatorService } from 'app/organisator/organisator.service';
import { EventService } from 'app/views/event/event.service';
import dayjs from 'dayjs';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { EventService as EventUserService } from "app/views/event/event.service";
import { IUser } from 'app/entities/user/user.model';
import { DeliveryType } from 'app/entities/delivery-type/delivery-type.model';
import { RentStatus } from 'app/entities/enumerations/rent-status.model';
import { ProductType } from 'app/entities/enumerations/product-type.model';

@Component({
  selector: 'jhi-add-product-to-event',
  templateUrl: './add-product-to-event.component.html',
  styleUrls: ['./add-product-to-event.component.scss'],
  providers: [MessageService, CurrencyPipe, DialogService]
})
export class AddProductToEventComponent implements OnInit {


  product: IProduct;
  eventsFromUser: IEvent[] = [];
  jhiEvent: IEvent;

  eventProductOrders: IEventProductOrder[];
  eventServiceMapOrders: IEventServiceMapOrder[];

  totalCosts = 0;
  revenue = 0;
  investment = 0;

  isSaving = false;
  isAdding = false;
  isRemoving = false;

  displayDialog = false;

  public totalProducts = 0;
  public totalServices = 0;
  public totalRideCosts = 0;
  public totalCart = 0;
  public totalShipping = 0;
  public totalDeliveryCosts = 0;
  public totalDeliveryRideCosts = 0;


  config = {
    displayKey:"name", //if objects array passed which key to be displayed defaults to description
    search:true, //true/false for the search functionlity defaults to false,
    height: 'auto', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
    placeholder:'Select', // text to be displayed when no item is selected defaults to Select,
    limitTo: 0, // number thats limits the no of options displayed in the UI (if zero, options will not be limited)
    moreText: 'more', // text to be displayed whenmore than one items are selected like Option 1 + 5 more
    noResultsFound: 'No results found!', // text to be displayed when no items are found while searching
    searchPlaceholder:'Search', // label thats displayed in search input,
    searchOnKey: 'name', // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
    clearOnSelection: false, // clears search criteria when an option is selected if set to true, default is false
  }

  constructor(private generalService: GeneralService,
              private route: ActivatedRoute,
              private productService: ProductService,
              private router: Router,
              private eventOrderProductService: EventProductOrderService,
              private jhiEventService: EventService,
              private messageService: MessageService,
              private translate: TranslateService,

              protected shopService: ShopService,
              protected eventService: EventService,
              public sharedEventService: SharedEventService,
              protected organisatorService: OrganisatorService,
              private eventUserService: EventUserService,
              private eventProductOrderService: EventProductOrderService,
              private googleGeocoderService: GoogleGeocodeService,
              private deliveryTypeService: DeliveryTypeService,
              private currencyPipe: CurrencyPipe,
              public dialogService: DialogService) {

  }

  ngOnInit() {
    const productId = this.route.snapshot.params['id'];
    this.productService.find(productId).subscribe(pro => {
      this.product = pro.body;
    });

    this.generalService.findWidthAuthorities().subscribe(u => {
      const user = u.body;

      this.generalService.findAllEventsByActiveTrueAndDateEndAfterAndUserId(dayjs(), user.id).subscribe(e => {
        const eventsFromUser = e.body;
        eventsFromUser.forEach(element => {
          if(element.active) {
            this.eventsFromUser.push(element);
            this.eventsFromUser = this.eventsFromUser.splice(0);
          }
        });
      });
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

getDisabledSellingPrice(id: number): boolean {
  const cspe = document.getElementById('checkSellingPrice---' + id) as HTMLInputElement;
  if(cspe === null) {
    return true;
  }
  return !cspe.checked;
}

showAddProduct(): boolean {
  let show = false;
  if(!this.eventProductOrders) {
    return show;
  }
  const found = this.eventProductOrders.findIndex(x => x.product.id === this.product.id);
  if(found >= 0) {
    show = false;
  } else {
    show = true;
  }
  return show;
}

changeEvent(e: any) {
  this.jhiEvent = e.value;
  this.generalService.findEventProductOrdersByEventId(this.jhiEvent.id).subscribe(ev => {
    this.eventProductOrders = ev.body;

    this.generalService.getAllEventServiceMapsOrdersByEventId(this.jhiEvent.id).subscribe(res => {
      this.eventServiceMapOrders = res.body;
      this.eventServiceMapOrders.forEach(order => {
        this.totalServices += order.total;
      });
      this.calcRevenue();
      this.getInvestment();
      this.calcProducts();
      this.calcTotalCosts();
      this.calcShipping();
      this.calcDeliveryCosts();
      this.calcTotalInCart();
    })
  });
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
  if(this.eventServiceMapOrders === undefined) {
    return;
  }
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
  if(this.eventServiceMapOrders === undefined) {
    return;
  }
  this.eventServiceMapOrders.forEach(element => {
    totalRideCosts += element.rideCosts!;
  });
  this.totalRideCosts = totalRideCosts;
  return this.totalRideCosts;
}

calcTotalInCart(): number {
  this.totalCart =
    this.calcProducts() +
    this.totalDeliveryCosts +
    this.totalDeliveryRideCosts +
    this.totalShipping +
    this.totalServices +
    this.totalRideCosts;
  return this.totalCart;
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
  if(this.eventServiceMapOrders === undefined) {
    return;
  }
  this.eventProductOrders.forEach(element => {
    totalProducts += element.total!;
  });
  this.totalProducts = totalProducts;
  return this.totalProducts;
}

calcMinimumEntry(): number {
  return this.jhiEvent.minPlacenumber * this.jhiEvent.price;
}

calcTotalToBuy(): number {
  return this.calcMinimumEntry() - this.calcTotalInCart();
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

          if (this.jhiEvent.investment + this.revenue < this.totalCart + eventProductOrder.total) {
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

              this.calcRevenue();
              this.getInvestment();
              this.calcProducts();
              this.calcTotalCosts();
              this.calcShipping();
              this.calcDeliveryCosts();
              this.calcTotalInCart();
              this.isAdding = false;
              this.displayDialog = false;
              this.messageService.add({
                key: 'myKey1',
                severity: 'success',
                summary: this.translate.instant('select-products.success'),
                detail: this.translate.instant('select-products.product-successfully-added')
              });
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
                          this.calcRevenue();
                          this.getInvestment();
                          this.calcProducts();
                          this.calcTotalCosts();
                          this.calcShipping();
                          this.calcDeliveryCosts();
                          this.calcTotalInCart();
                          this.isAdding = false;
                          this.displayDialog = false;
                          this.messageService.add({
                            key: 'myKey1',
                            severity: 'success',
                            summary: this.translate.instant('select-products.success'),
                            detail: this.translate.instant('select-products.product-successfully-added')
                          });
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
        this.eventOrderProductService.delete(productEventOrder.id).subscribe(() => {
          this.generalService.findEventProductOrdersByEventId(this.jhiEvent.id).subscribe(ev => {
            this.eventProductOrders = ev.body;
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
        this.eventOrderProductService.delete(productEventOrder.id).subscribe(() => {
          this.generalService.findEventProductOrdersByEventId(this.jhiEvent.id).subscribe(ev => {
            this.eventProductOrders = ev.body;
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
        this.eventOrderProductService.delete(productEventOrder.id).subscribe(() => {
          this.generalService.findEventProductOrdersByEventId(this.jhiEvent.id).subscribe(ev => {
            this.eventProductOrders = ev.body;
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
        this.eventOrderProductService.delete(productEventOrder.id).subscribe(() => {
          this.generalService.findEventProductOrdersByEventId(this.jhiEvent.id).subscribe(ev => {
            this.eventProductOrders = ev.body;
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
        this.eventOrderProductService.delete(productEventOrder.id).subscribe(() => {
          this.generalService.findEventProductOrdersByEventId(this.jhiEvent.id).subscribe(ev => {
            this.eventProductOrders = ev.body;
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
        this.eventOrderProductService.delete(productEventOrder.id).subscribe(() => {
          this.generalService.findEventProductOrdersByEventId(this.jhiEvent.id).subscribe(ev => {
            this.eventProductOrders = ev.body;
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
        this.eventOrderProductService.delete(productEventOrder.id).subscribe(() => {
          this.generalService.findEventProductOrdersByEventId(this.jhiEvent.id).subscribe(ev => {
            this.eventProductOrders = ev.body;
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

}
