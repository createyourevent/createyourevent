import * as dayjs from 'dayjs';
import { IEvent } from 'app/entities/event/event.model';
import { IUser } from 'app/entities/user/user.model';

export interface IEventStarRating {
  id?: number;
  stars?: number | null;
  date?: dayjs.Dayjs | null;
  comment?: string | null;
  event?: IEvent | null;
  user?: IUser | null;
}

export class EventStarRating implements IEventStarRating {
  constructor(
    public id?: number,
    public stars?: number | null,
    public date?: dayjs.Dayjs | null,
    public comment?: string | null,
    public event?: IEvent | null,
    public user?: IUser | null
  ) {}
}

export function getEventStarRatingIdentifier(eventStarRating: IEventStarRating): number | undefined {
  return eventStarRating.id;
}
