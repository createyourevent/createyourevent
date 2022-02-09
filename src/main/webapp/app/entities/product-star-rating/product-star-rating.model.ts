import * as dayjs from 'dayjs';
import { IProduct } from 'app/entities/product/product.model';
import { IUser } from 'app/entities/user/user.model';

export interface IProductStarRating {
  id?: number;
  stars?: number | null;
  date?: dayjs.Dayjs | null;
  comment?: string | null;
  product?: IProduct | null;
  user?: IUser | null;
}

export class ProductStarRating implements IProductStarRating {
  constructor(
    public id?: number,
    public stars?: number | null,
    public date?: dayjs.Dayjs | null,
    public comment?: string | null,
    public product?: IProduct | null,
    public user?: IUser | null
  ) {}
}

export function getProductStarRatingIdentifier(productStarRating: IProductStarRating): number | undefined {
  return productStarRating.id;
}
