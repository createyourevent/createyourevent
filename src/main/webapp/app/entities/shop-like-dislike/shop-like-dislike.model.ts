import * as dayjs from 'dayjs';
import { IShop } from 'app/entities/shop/shop.model';
import { IUser } from 'app/entities/user/user.model';

export interface IShopLikeDislike {
  id?: number;
  like?: number | null;
  dislike?: number | null;
  date?: dayjs.Dayjs | null;
  comment?: string | null;
  shop?: IShop | null;
  user?: IUser | null;
}

export class ShopLikeDislike implements IShopLikeDislike {
  constructor(
    public id?: number,
    public like?: number | null,
    public dislike?: number | null,
    public date?: dayjs.Dayjs | null,
    public comment?: string | null,
    public shop?: IShop | null,
    public user?: IUser | null
  ) {}
}

export function getShopLikeDislikeIdentifier(shopLikeDislike: IShopLikeDislike): number | undefined {
  return shopLikeDislike.id;
}
