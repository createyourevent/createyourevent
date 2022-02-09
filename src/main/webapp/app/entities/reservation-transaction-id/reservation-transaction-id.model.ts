import { IReservation } from 'app/entities/reservation/reservation.model';

export interface IReservationTransactionId {
  id?: number;
  transactionDepositId?: string | null;
  transactionId?: string | null;
  reservation?: IReservation | null;
}

export class ReservationTransactionId implements IReservationTransactionId {
  constructor(
    public id?: number,
    public transactionDepositId?: string | null,
    public transactionId?: string | null,
    public reservation?: IReservation | null
  ) {}
}

export function getReservationTransactionIdIdentifier(reservationTransactionId: IReservationTransactionId): number | undefined {
  return reservationTransactionId.id;
}
