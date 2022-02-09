import * as dayjs from 'dayjs';
import { IProduct } from 'app/entities/product/product.model';
import { IUser } from 'app/entities/user/user.model';

export interface IProductLikeDislike {
  id?: number;
  like?: number | null;
  dislike?: number | null;
  date?: dayjs.Dayjs | null;
  comment?: string | null;
  product?: IProduct | null;
  user?: IUser | null;
}

export class ProductLikeDislike implements IProductLikeDislike {
  constructor(
    public id?: number,
    public like?: number | null,
    public dislike?: number | null,
    public date?: dayjs.Dayjs | null,
    public comment?: string | null,
    public product?: IProduct | null,
    public user?: IUser | null
  ) {}
}

export function getProductLikeDislikeIdentifier(productLikeDislike: IProductLikeDislike): number | undefined {
  return productLikeDislike.id;
}
