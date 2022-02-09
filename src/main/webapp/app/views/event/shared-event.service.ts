import { Injectable } from '@angular/core';
import { DeliveryTypes } from 'app/entities/enumerations/delivery-types.model';
import { IEventProductOrder } from 'app/entities/event-product-order/event-product-order.model';
import { IEventServiceMapOrder } from 'app/entities/event-service-map-order/event-service-map-order.model';
import { IShop } from 'app/entities/shop/shop.model';
import { GoogleGeocodeService } from 'app/google-geocode.service';


@Injectable({ providedIn: 'root' })
export class SharedEventService {
  public sharedEvent: any = {};
  public sharedFlyer = '';
  public sharedFlyerContentType = '';
  public sharedYoutube = '';
  public selectedEventProductOrders: IEventProductOrder[] = [];

  public select_products: string[] = [];
  public select_services: string[] = [];

  public totalProducts = 0;
  public totalServices = 0;
  public totalRideCosts = 0;
  public totalCart = 0;
  public totalShipping = 0;
  public totalDeliveryCosts = 0;
  public totalDeliveryRideCosts = 0;

  model: any;

  constructor(private googleGeocoderService: GoogleGeocodeService) {
  }

  getInvestment(): number {
    this.model = this.sharedEvent;
    return Number(this.model.investment);
  }

  calcRevenue(): number {
    this.model = this.sharedEvent;
    return Number(this.model.price) * Number(this.model.minPlacenumber);
  }

  calcProducts(): number {
    let totalProducts = 0;
    this.selectedEventProductOrders.forEach(element => {
      totalProducts += element.total!;
    });
    this.totalProducts = totalProducts;
    return this.totalProducts;
  }



  calcTotalInCart(): number {
    this.totalCart =
      this.calcProducts() +
      this.totalDeliveryCosts +
      this.totalDeliveryRideCosts +
      this.totalShipping;
    return this.totalCart;
  }

  calcShipping(): number {
    let shippingCosts = 0;
    if (this.selectedEventProductOrders.length === 0) {
      return -1;
    }
    this.selectedEventProductOrders.forEach(element => {
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

    if (this.selectedEventProductOrders.length === 0) {
      return;
    }
    let tdc = 0;
    this.selectedEventProductOrders.forEach(element => {
      tdc += element.deliveryType!.price!;
    });
    this.totalDeliveryCosts = tdc / this.selectedEventProductOrders.length;

    let shops: IShop[] = [];
    let rideCosts: number[] = [];

    this.selectedEventProductOrders.forEach(element => {
      const found = shops.find(x => x.id === element.shop!.id);
      if (!found || found === undefined) {
        shops.push(element.shop!);
        const shopOrders = this.selectedEventProductOrders.filter(x => x.shop!.id === element.shop!.id);
        let trc = 0;
        shopOrders.forEach(shopOrder => {
          trc += shopOrder.deliveryType!.pricePerKilometre!;
        });
        rideCosts.push(trc / shopOrders.length);
      }
    });

    this.model = this.sharedEvent;
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
      const addressEvent = this.model.address;
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
}
