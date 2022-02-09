import * as dayjs from 'dayjs';
import { IProduct } from 'app/entities/product/product.model';
import { IEvent } from 'app/entities/event/event.model';
import { IUser } from 'app/entities/user/user.model';

export interface IEventProductRating {
  id?: number;
  like?: number | null;
  dislike?: number | null;
  date?: dayjs.Dayjs | null;
  comment?: string | null;
  product?: IProduct | null;
  event?: IEvent | null;
  user?: IUser | null;
}

export class EventProductRating implements IEventProductRating {
  constructor(
    public id?: number,
    public like?: number | null,
    public dislike?: number | null,
    public date?: dayjs.Dayjs | null,
    public comment?: string | null,
    public product?: IProduct | null,
    public event?: IEvent | null,
    public user?: IUser | null
  ) {}
}

export function getEventProductRatingIdentifier(eventProductRating: IEventProductRating): number | undefined {
  return eventProductRating.id;
}
