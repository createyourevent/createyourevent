import * as dayjs from 'dayjs';
import { IEvent } from 'app/entities/event/event.model';
import { IUser } from 'app/entities/user/user.model';
import { IReservation } from 'app/entities/reservation/reservation.model';

export interface ITicket {
  id?: number;
  amount?: number | null;
  total?: number | null;
  date?: dayjs.Dayjs | null;
  refNo?: string | null;
  accessDate?: dayjs.Dayjs | null;
  ticketsUsed?: number | null;
  event?: IEvent | null;
  user?: IUser | null;
  reservation?: IReservation | null;
}

export class Ticket implements ITicket {
  constructor(
    public id?: number,
    public amount?: number | null,
    public total?: number | null,
    public date?: dayjs.Dayjs | null,
    public refNo?: string | null,
    public accessDate?: dayjs.Dayjs | null,
    public ticketsUsed?: number | null,
    public event?: IEvent | null,
    public user?: IUser | null,
    public reservation?: IReservation | null
  ) {}
}

export function getTicketIdentifier(ticket: ITicket): number | undefined {
  return ticket.id;
}
