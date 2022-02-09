import * as dayjs from 'dayjs';
import { IShop } from 'app/entities/shop/shop.model';
import { IUser } from 'app/entities/user/user.model';

export interface IShopComment {
  id?: number;
  comment?: string | null;
  date?: dayjs.Dayjs | null;
  shopComments?: IShopComment[] | null;
  shop?: IShop | null;
  user?: IUser | null;
  shopComment?: IShopComment | null;
}

export class ShopComment implements IShopComment {
  constructor(
    public id?: number,
    public comment?: string | null,
    public date?: dayjs.Dayjs | null,
    public shopComments?: IShopComment[] | null,
    public shop?: IShop | null,
    public user?: IUser | null,
    public shopComment?: IShopComment | null
  ) {}
}

export function getShopCommentIdentifier(shopComment: IShopComment): number | undefined {
  return shopComment.id;
}
