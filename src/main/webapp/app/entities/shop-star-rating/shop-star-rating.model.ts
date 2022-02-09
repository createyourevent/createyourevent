import * as dayjs from 'dayjs';
import { IShop } from 'app/entities/shop/shop.model';
import { IUser } from 'app/entities/user/user.model';

export interface IShopStarRating {
  id?: number;
  stars?: number | null;
  date?: dayjs.Dayjs | null;
  comment?: string | null;
  shop?: IShop | null;
  user?: IUser | null;
}

export class ShopStarRating implements IShopStarRating {
  constructor(
    public id?: number,
    public stars?: number | null,
    public date?: dayjs.Dayjs | null,
    public comment?: string | null,
    public shop?: IShop | null,
    public user?: IUser | null
  ) {}
}

export function getShopStarRatingIdentifier(shopStarRating: IShopStarRating): number | undefined {
  return shopStarRating.id;
}
