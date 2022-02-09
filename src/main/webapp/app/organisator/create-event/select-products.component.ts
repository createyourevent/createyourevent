import { CurrencyPipe } from "@angular/common";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { DeliveryType } from "app/entities/delivery-type/delivery-type.model";
import { DeliveryTypeService } from "app/entities/delivery-type/service/delivery-type.service";
import { PriceType } from "app/entities/enumerations/price-type.model";
import { ProductType } from "app/entities/enumerations/product-type.model";
import { RentStatus } from "app/entities/enumerations/rent-status.model";
import { RentType } from "app/entities/enumerations/rent-type.model";
import { IEventProductOrder, EventProductOrder } from "app/entities/event-product-order/event-product-order.model";
import { EventProductOrderService } from "app/entities/event-product-order/service/event-product-order.service";
import { IProduct } from "app/entities/product/product.model";
import { ProductService } from "app/entities/product/service/product.service";
import { ShopService } from "app/entities/shop/service/shop.service";
import { IShop } from "app/entities/shop/shop.model";
import { IUser } from "app/entities/user/user.model";
import { GeneralService } from "app/general.service";
import { GoogleGeocodeService } from "app/google-geocode.service";
import { EventService as EventUserService } from "app/views/event/event.service";
import { EventService } from "app/views/event/event.service";
import { MessageService } from "primeng/api";
import { OrganisatorService } from "../organisator.service";
import { SharedEventService } from "./shared-event.service";
import * as dayjs from "dayjs";
import { DialogService } from "primeng/dynamicdialog";
import { RentCalendarComponent } from "./rent-calendar.component";


@Component({
  selector: 'jhi-select-products',
  templateUrl: './select-products.component.html',
  styleUrls: ['select-products.component.scss'],
  providers: [MessageService, CurrencyPipe, DialogService]
})
export class SelectProductsComponent implements OnInit, OnDestroy {
  model: any;

  items: ProductType[] = [];
  selectedItems: string[] = [];
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
  selectedEventProductOrders: IEventProductOrder[] = [];

  searchTextRealEstate = '';
  searchTextFood = '';
  searchTextDrink = '';
  searchTextMusic = '';
  searchTextLightshow = '';
  searchTextDecoration = '';
  searchTextMiscellaneous = '';

  distanceSlider = 0;
  posEvent!: google.maps.LatLng;

  constructor(
    protected shopService: ShopService,
    protected productService: ProductService,
    protected eventService: EventService,
    public sharedEventService: SharedEventService,
    protected organisatorService: OrganisatorService,
    private router: Router,
    private eventUserService: EventUserService,
    private eventProductOrderService: EventProductOrderService,
    private googleGeocoderService: GoogleGeocodeService,
    private generalService: GeneralService,
    private messageService: MessageService,
    private translate: TranslateService,
    private deliveryTypeService: DeliveryTypeService,
    private currencyPipe: CurrencyPipe,
    public dialogService: DialogService
  ) {
    this.model = this.sharedEventService.sharedEvent;
    this.selectedEventProductOrders = this.sharedEventService.selectedEventProductOrders;

    this.selectedItems = this.sharedEventService.select_products;

    this.selectedItems.forEach(item => {
      switch (item) {
        case 'real_estate':
          this.items.push(ProductType.REAL_ESTATE);
          break;
        case 'food':
          this.items.push(ProductType.FOOD);
          break;
        case 'drink':
          this.items.push(ProductType.DRINK);
          break;
        case 'music':
          this.items.push(ProductType.MUSIC);
          break;
        case 'lightshow':
          this.items.push(ProductType.LIGHTSHOW);
          break;
        case 'decoration':
          this.items.push(ProductType.DECORATION);
          break;
        case 'miscellaneous':
          this.items.push(ProductType.MISCELLANEOUS);
          break;
      }
    });

    this.getInvestment();
    this.calcRevenue();
    this.calcTotalCosts();
    this.getOrganizationCosts();
  }

  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.items.forEach(item => {
      switch (item) {
        case ProductType.REAL_ESTATE:
          this.loadShopsProductsRealEstate();
          break;
        case ProductType.FOOD:
          this.loadShopsProductsFood();
          break;
        case ProductType.DRINK:
          this.loadShopsProductsDrink();
          break;
        case ProductType.MUSIC:
          this.loadShopsProductsMusic();
          break;
        case ProductType.LIGHTSHOW:
          this.loadShopsProductsLightshow();
          break;
        case ProductType.DECORATION:
          this.loadShopsProductsDecoration();
          break;
        case ProductType.MISCELLANEOUS:
          this.loadShopsProductsMiscellaneous();
          break;
      }
    });

  let addressEvent = '';
  if(!this.sharedEventService.organization){
    addressEvent = this.model.address;
  }else {
    addressEvent = this.sharedEventService.organization.address;
  }


    let latEvent = 0;
    let lngEvent = 0;


    const queryParamEvent = addressEvent.replace(' ', '+');
    this.googleGeocoderService.getFromAddress(queryParamEvent).subscribe((resShop: any) => {
      const geocoderShop = resShop.body!['results'];
      const geometryShop = geocoderShop[0].geometry;
      latEvent = geometryShop.location.lat;
      lngEvent = geometryShop.location.lng;
      this.posEvent = new google.maps.LatLng(latEvent, lngEvent);
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
                const found = this.sharedEventService.selectedEventProductOrders.find(element => element.product!.id === product.id);
                const foundOwn = this.productsRealEstate.find(element => element.id === product.id);
                if (product.stock! > 0 && !found && !foundOwn) this.productsRealEstate.push(product);
                else if (product.stock! < 0 && !found && !foundOwn) this.productsRealEstate.push(product);
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
                const found = this.sharedEventService.selectedEventProductOrders.find(element => element.product!.id === product.id);
                const foundOwn = this.productsFood.find(element => element.id === product.id);
                if (product.stock! > 0 && !found && !foundOwn) this.productsFood.push(product);
                else if (product.stock! < 0 && !found && !foundOwn) this.productsFood.push(product);
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
                const found = this.sharedEventService.selectedEventProductOrders.find(element => element.product!.id === product.id);
                const foundOwn = this.productsDrink.find(element => element.id === product.id);
                if (product.stock! > 0 && !found && !foundOwn) this.productsDrink.push(product);
                else if (product.stock! < 0 && !found && !foundOwn) this.productsDrink.push(product);
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
                const found = this.sharedEventService.selectedEventProductOrders.find(element => element.product!.id === product.id);
                const foundOwn = this.productsMusic.find(element => element.id === product.id);
                if (product.stock! > 0 && !found && !foundOwn) this.productsMusic.push(product);
                else if (product.stock! < 0 && !found && !foundOwn) this.productsMusic.push(product);
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
                const found = this.sharedEventService.selectedEventProductOrders.find(element => element.product!.id === product.id);
                const foundOwn = this.productsLightshow.find(element => element.id === product.id);
                if (product.stock! > 0 && !found && !foundOwn) this.productsLightshow.push(product);
                else if (product.stock! < 0 && !found && !foundOwn) this.productsLightshow.push(product);
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
                const found = this.sharedEventService.selectedEventProductOrders.find(element => element.product!.id === product.id);
                const foundOwn = this.productsDecoration.find(element => element.id === product.id);
                if (product.stock! > 0 && !found && !foundOwn) this.productsDecoration.push(product);
                else if (product.stock! < 0 && !found && !foundOwn) this.productsDecoration.push(product);
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
                const found = this.sharedEventService.selectedEventProductOrders.find(element => element.product!.id === product.id);
                const foundOwn = this.productsMiscellaneous.find(element => element.id === product.id);
                if (product.stock! > 0 && !found && !foundOwn) this.productsMiscellaneous.push(product);
                else if (product.stock! < 0 && !found && !foundOwn) this.productsMiscellaneous.push(product);
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
    this.sharedEventService.selectedEventProductOrders.forEach(selProd => {
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
              return;
            }

            this.calcTotalCosts();
            this.calcRevenue();
            this.getInvestment();

            if (this.sharedEventService.getLocationCosts() +this.sharedEventService.getInvestment() + this.sharedEventService.calcRevenue() < this.totalCosts + eventProductOrder.total) {
              this.isAdding = false;
              this.messageService.add({
                key: 'myKey1',
                severity: 'error',
                summary: this.translate.instant('select-products.error'),
                detail: this.translate.instant('select-products.not-enought-money')
              });
              return;
            }

            prod.stock! -= amount;
            if (prod.stock === 0) {
              prod.active = false;
            }

            this.sharedEventService.selectedEventProductOrders.push(eventProductOrder);

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

            this.calcTotalCosts();
            this.calcRevenue();
            this.sharedEventService.calcProducts();
            this.sharedEventService.calcShipping();
            this.sharedEventService.calcDeliveryCosts();
            this.sharedEventService.calcTotalInCart();
            this.isAdding = false;
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

                          if (eventProductOrder.product!.stock! - t - amount < 0) {
                            this.isAdding = false;
                            this.messageService.add({
                              key: 'myKey1',
                              severity: 'error',
                              summary: this.translate.instant('edit-products.error'),
                              detail: this.translate.instant('edit-products.not-enought-quantity-in-time')
                            });
                            return;
                          }
                          eventProductOrder.amount = Number(amount);
                          eventProductOrder.dateFrom = dateFrom;
                          eventProductOrder.dateUntil = dateUntil;
                          eventProductOrder.amount = Number(amount);
                          //eventProductOrder.total = eventProductOrder.amount * prod.price!;
                          eventProductOrder.product = prod;
                          eventProductOrder.shop = prod.shop;

                          if (this.sharedEventService.getInvestment() + this.sharedEventService.calcRevenue() < this.totalCosts + eventProductOrder.total) {
                            this.isAdding = false;
                            this.messageService.add({
                              key: 'myKey1',
                              severity: 'error',
                              summary: this.translate.instant('select-products.error'),
                              detail: this.translate.instant('select-products.not-enought-money')
                            });
                            return;
                          }

                          if (prod.priceType !== PriceType.RENT) {
                            prod.stock! -= eventProductOrder.amount;
                          } else {
                            eventProductOrder.status = RentStatus.BOOKED;
                          }

                          this.sharedEventService.selectedEventProductOrders.push(eventProductOrder);

                          this.calcTotalCosts();
                          this.calcRevenue();
                          this.getInvestment();
                          this.sharedEventService.calcProducts();
                          this.sharedEventService.calcShipping();
                          this.sharedEventService.calcTotalInCart();

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

                          this.calcTotalCosts();
                          this.calcRevenue();
                          this.sharedEventService.calcProducts();
                          this.sharedEventService.calcShipping();
                          this.sharedEventService.calcDeliveryCosts();
                          this.sharedEventService.calcTotalInCart();
                          this.isAdding = false;
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

  removeFromProductlist(productId: number): void {
    this.isRemoving = true;
    this.productService.find(productId).subscribe(product => {
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
        this.calcTotalCosts();
        this.sharedEventService.calcProducts();
        this.sharedEventService.calcServices();
        this.sharedEventService.calcShipping();
        this.sharedEventService.calcDeliveryCosts();
        this.sharedEventService.calcTotalInCart();
        this.isRemoving = false;
      });
    });
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

    this.sharedEventService.selectedEventProductOrders.forEach(eventProductOrder => {
      if (eventProductOrder.product!.priceType === PriceType.SELL) {
        sum = eventProductOrder.product!.price! * eventProductOrder.amount!;
      } else if (eventProductOrder.product!.priceType === PriceType.RENT) {
        const duration = dayjs.duration(eventProductOrder.dateUntil!.diff(eventProductOrder.dateFrom!));
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
          sum = eventProductOrder.product!.price! * eventProductOrder.amount! * factor;
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
    this.sharedEventService.selectedEventProductOrders.forEach(eventProductOrder => {
      all += eventProductOrder.total!;
    });

    this.totalCosts = all;
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

  getInvestment(): void {
    this.investment = Number(this.model.investment);
  }

  getOrganizationCosts(): void {
    this.totalLocationCosts = Number(this.sharedEventService.organizationReservation.total);
  }

  calcRevenue(): void {
    this.revenue = Number(this.model.price) * Number(this.model.minPlacenumber);
  }

  previousState(): void {
    this.router.navigate(['/organisator/create-event/flyer']);
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
