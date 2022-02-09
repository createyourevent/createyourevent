import * as dayjs from 'dayjs';
import { IEvent } from 'app/entities/event/event.model';
import { IUser } from 'app/entities/user/user.model';

export interface IEventComment {
  id?: number;
  comment?: string | null;
  date?: dayjs.Dayjs | null;
  eventComments?: IEventComment[] | null;
  event?: IEvent | null;
  user?: IUser | null;
  eventComment?: IEventComment | null;
}

export class EventComment implements IEventComment {
  constructor(
    public id?: number,
    public comment?: string | null,
    public date?: dayjs.Dayjs | null,
    public eventComments?: IEventComment[] | null,
    public event?: IEvent | null,
    public user?: IUser | null,
    public eventComment?: IEventComment | null
  ) {}
}

export function getEventCommentIdentifier(eventComment: IEventComment): number | undefined {
  return eventComment.id;
}
