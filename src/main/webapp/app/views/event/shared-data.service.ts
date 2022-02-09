import { Injectable } from '@angular/core';
import { IEventProductOrder } from 'app/entities/event-product-order/event-product-order.model';
import { IProduct } from 'app/entities/product/product.model';


@Injectable({ providedIn: 'root' })
export class SharedDataService {
  public sharedEventSequence = 0;
  public sharedEvent = {};
  public sharedFlyer = '';
  public sharedFlyerContentType = '';
  public sharedRealEstateProducts: IProduct[] = [];
  public sharedFoodProducts: IProduct[] = [];
  public sharedDrinkProducts: IProduct[] = [];
  public sharedMusicProducts: IProduct[] = [];
  public sharedLightshowProducts: IProduct[] = [];
  public sharedDecorationProducts: IProduct[] = [];
  public sharedMiscellaneousProducts: IProduct[] = [];
  public selectedEventProductOrders: IEventProductOrder[] = [];
}
