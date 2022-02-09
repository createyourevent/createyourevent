import * as dayjs from 'dayjs';
import { IEventProductOrder } from 'app/entities/event-product-order/event-product-order.model';
import { IEventProductRatingComment } from 'app/entities/event-product-rating-comment/event-product-rating-comment.model';
import { IWorksheet } from 'app/entities/worksheet/worksheet.model';
import { IImage } from 'app/entities/image/image.model';
import { IMp3 } from 'app/entities/mp-3/mp-3.model';
import { IShop } from 'app/entities/shop/shop.model';
import { ITags } from 'app/entities/tags/tags.model';
import { IDeliveryType } from 'app/entities/delivery-type/delivery-type.model';
import { PriceType } from 'app/entities/enumerations/price-type.model';
import { RentType } from 'app/entities/enumerations/rent-type.model';
import { ProductType } from 'app/entities/enumerations/product-type.model';
import { OrderStatus } from 'app/entities/enumerations/order-status.model';
import { Unit } from 'app/entities/enumerations/unit.model';

export interface IProduct {
  id?: number;
  title?: string;
  keywords?: string | null;
  description?: string;
  dateAdded?: dayjs.Dayjs | null;
  dateModified?: dayjs.Dayjs | null;
  priceType?: PriceType | null;
  rentType?: RentType | null;
  price?: number;
  photoContentType?: string;
  photo?: string;
  photo2ContentType?: string | null;
  photo2?: string | null;
  photo3ContentType?: string | null;
  photo3?: string | null;
  youtube?: string | null;
  active?: boolean | null;
  stock?: number;
  productType?: ProductType | null;
  itemNumber?: string | null;
  status?: OrderStatus | null;
  unit?: Unit;
  amount?: number | null;
  motto?: string;
  eventProductOrders?: IEventProductOrder[] | null;
  comments?: IEventProductRatingComment[] | null;
  worksheets?: IWorksheet[] | null;
  images?: IImage[] | null;
  mp3s?: IMp3[] | null;
  shop?: IShop | null;
  tags?: ITags[] | null;
  deliveryTypes?: IDeliveryType[] | null;
}

export class Product implements IProduct {
  constructor(
    public id?: number,
    public title?: string,
    public keywords?: string | null,
    public description?: string,
    public dateAdded?: dayjs.Dayjs | null,
    public dateModified?: dayjs.Dayjs | null,
    public priceType?: PriceType | null,
    public rentType?: RentType | null,
    public price?: number,
    public photoContentType?: string,
    public photo?: string,
    public photo2ContentType?: string | null,
    public photo2?: string | null,
    public photo3ContentType?: string | null,
    public photo3?: string | null,
    public youtube?: string | null,
    public active?: boolean | null,
    public stock?: number,
    public productType?: ProductType | null,
    public itemNumber?: string | null,
    public status?: OrderStatus | null,
    public unit?: Unit,
    public amount?: number | null,
    public motto?: string,
    public eventProductOrders?: IEventProductOrder[] | null,
    public comments?: IEventProductRatingComment[] | null,
    public worksheets?: IWorksheet[] | null,
    public images?: IImage[] | null,
    public mp3s?: IMp3[] | null,
    public shop?: IShop | null,
    public tags?: ITags[] | null,
    public deliveryTypes?: IDeliveryType[] | null
  ) {
    this.active = this.active ?? false;
  }
}

export function getProductIdentifier(product: IProduct): number | undefined {
  return product.id;
}
