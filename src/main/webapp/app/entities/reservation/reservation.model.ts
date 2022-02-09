import * as dayjs from 'dayjs';
import { IReservationTransactionId } from 'app/entities/reservation-transaction-id/reservation-transaction-id.model';
import { ITicket } from 'app/entities/ticket/ticket.model';
import { IUser } from 'app/entities/user/user.model';
import { IEvent } from 'app/entities/event/event.model';

export interface IReservation {
  id?: number;
  date?: dayjs.Dayjs | null;
  billed?: boolean | null;
  accessEvent?: boolean | null;
  accessDate?: dayjs.Dayjs | null;
  tdTxId?: string | null;
  transactionId?: IReservationTransactionId | null;
  ticket?: ITicket | null;
  user?: IUser | null;
  event?: IEvent | null;
}

export class Reservation implements IReservation {
  constructor(
    public id?: number,
    public date?: dayjs.Dayjs | null,
    public billed?: boolean | null,
    public accessEvent?: boolean | null,
    public accessDate?: dayjs.Dayjs | null,
    public tdTxId?: string | null,
    public transactionId?: IReservationTransactionId | null,
    public ticket?: ITicket | null,
    public user?: IUser | null,
    public event?: IEvent | null
  ) {
    this.billed = this.billed ?? false;
    this.accessEvent = this.accessEvent ?? false;
  }
}

export function getReservationIdentifier(reservation: IReservation): number | undefined {
  return reservation.id;
}
