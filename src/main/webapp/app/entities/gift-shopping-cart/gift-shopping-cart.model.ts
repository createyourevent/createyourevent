import * as dayjs from 'dayjs';
import { IUser } from 'app/entities/user/user.model';
import { IGift } from 'app/entities/gift/gift.model';

export interface IGiftShoppingCart {
  id?: number;
  date?: dayjs.Dayjs | null;
  amount?: number | null;
  user?: IUser | null;
  gift?: IGift | null;
}

export class GiftShoppingCart implements IGiftShoppingCart {
  constructor(
    public id?: number,
    public date?: dayjs.Dayjs | null,
    public amount?: number | null,
    public user?: IUser | null,
    public gift?: IGift | null
  ) {}
}

export function getGiftShoppingCartIdentifier(giftShoppingCart: IGiftShoppingCart): number | undefined {
  return giftShoppingCart.id;
}
