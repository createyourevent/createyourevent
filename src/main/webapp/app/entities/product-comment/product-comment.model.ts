import * as dayjs from 'dayjs';
import { IProduct } from 'app/entities/product/product.model';
import { IUser } from 'app/entities/user/user.model';

export interface IProductComment {
  id?: number;
  comment?: string | null;
  date?: dayjs.Dayjs | null;
  productComments?: IProductComment[] | null;
  product?: IProduct | null;
  user?: IUser | null;
  productComment?: IProductComment | null;
}

export class ProductComment implements IProductComment {
  constructor(
    public id?: number,
    public comment?: string | null,
    public date?: dayjs.Dayjs | null,
    public productComments?: IProductComment[] | null,
    public product?: IProduct | null,
    public user?: IUser | null,
    public productComment?: IProductComment | null
  ) {}
}

export function getProductCommentIdentifier(productComment: IProductComment): number | undefined {
  return productComment.id;
}
