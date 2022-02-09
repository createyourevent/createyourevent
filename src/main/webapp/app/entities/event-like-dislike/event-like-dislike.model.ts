import * as dayjs from 'dayjs';
import { IEvent } from 'app/entities/event/event.model';
import { IUser } from 'app/entities/user/user.model';

export interface IEventLikeDislike {
  id?: number;
  like?: number | null;
  dislike?: number | null;
  date?: dayjs.Dayjs | null;
  comment?: string | null;
  event?: IEvent | null;
  user?: IUser | null;
}

export class EventLikeDislike implements IEventLikeDislike {
  constructor(
    public id?: number,
    public like?: number | null,
    public dislike?: number | null,
    public date?: dayjs.Dayjs | null,
    public comment?: string | null,
    public event?: IEvent | null,
    public user?: IUser | null
  ) {}
}

export function getEventLikeDislikeIdentifier(eventLikeDislike: IEventLikeDislike): number | undefined {
  return eventLikeDislike.id;
}
