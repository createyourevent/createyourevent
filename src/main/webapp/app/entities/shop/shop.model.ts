import { IProduct } from 'app/entities/product/product.model';
import { IEventProductOrder } from 'app/entities/event-product-order/event-product-order.model';
import { IImage } from 'app/entities/image/image.model';
import { IMp3 } from 'app/entities/mp-3/mp-3.model';
import { IUser } from 'app/entities/user/user.model';
import { IShopComment } from 'app/entities/shop-comment/shop-comment.model';
import { ITags } from 'app/entities/tags/tags.model';
import { ProductType } from 'app/entities/enumerations/product-type.model';

export interface IShop {
  id?: number;
  name?: string;
  productType?: ProductType;
  logoContentType?: string | null;
  logo?: string | null;
  active?: boolean | null;
  activeOwner?: boolean | null;
  description?: string;
  address?: string;
  motto?: string;
  phone?: string;
  webAddress?: string | null;
  products?: IProduct[] | null;
  eventProductOrders?: IEventProductOrder[] | null;
  images?: IImage[] | null;
  mp3s?: IMp3[] | null;
  user?: IUser | null;
  comments?: IShopComment[] | null;
  tags?: ITags[] | null;
}

export class Shop implements IShop {
  constructor(
    public id?: number,
    public name?: string,
    public productType?: ProductType,
    public logoContentType?: string | null,
    public logo?: string | null,
    public active?: boolean | null,
    public activeOwner?: boolean | null,
    public description?: string,
    public address?: string,
    public motto?: string,
    public phone?: string,
    public webAddress?: string | null,
    public products?: IProduct[] | null,
    public eventProductOrders?: IEventProductOrder[] | null,
    public images?: IImage[] | null,
    public mp3s?: IMp3[] | null,
    public user?: IUser | null,
    public comments?: IShopComment[] | null,
    public tags?: ITags[] | null
  ) {
    this.active = this.active ?? false;
    this.activeOwner = this.activeOwner ?? false;
  }
}

export function getShopIdentifier(shop: IShop): number | undefined {
  return shop.id;
}
