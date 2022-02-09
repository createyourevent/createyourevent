import * as dayjs from 'dayjs';
import { IUser } from 'app/entities/user/user.model';
import { IEvent } from 'app/entities/event/event.model';
import { IProduct } from 'app/entities/product/product.model';

export interface IEventProductRatingComment {
  id?: number;
  comment?: string | null;
  date?: dayjs.Dayjs | null;
  user?: IUser | null;
  event?: IEvent | null;
  product?: IProduct | null;
}

export class EventProductRatingComment implements IEventProductRatingComment {
  constructor(
    public id?: number,
    public comment?: string | null,
    public date?: dayjs.Dayjs | null,
    public user?: IUser | null,
    public event?: IEvent | null,
    public product?: IProduct | null
  ) {}
}

export function getEventProductRatingCommentIdentifier(eventProductRatingComment: IEventProductRatingComment): number | undefined {
  return eventProductRatingComment.id;
}
