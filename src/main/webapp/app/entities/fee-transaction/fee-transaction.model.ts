import * as dayjs from 'dayjs';
import { IFeeTransactionId } from 'app/entities/fee-transaction-id/fee-transaction-id.model';
import { IEventProductOrder } from 'app/entities/event-product-order/event-product-order.model';
import { IEventServiceMapOrder } from 'app/entities/event-service-map-order/event-service-map-order.model';
import { IEvent } from 'app/entities/event/event.model';
import { IOrganizationReservation } from 'app/entities/organization-reservation/organization-reservation.model';
import { IFeeTransactionEntry } from 'app/entities/fee-transaction-entry/fee-transaction-entry.model';
import { IUser } from 'app/entities/user/user.model';

export interface IFeeTransaction {
  id?: number;
  date?: dayjs.Dayjs | null;
  transactionId?: IFeeTransactionId | null;
  eventProductOrder?: IEventProductOrder | null;
  eventServiceMapOrder?: IEventServiceMapOrder | null;
  event?: IEvent | null;
  organizationReservation?: IOrganizationReservation | null;
  entries?: IFeeTransactionEntry[] | null;
  user?: IUser | null;
}

export class FeeTransaction implements IFeeTransaction {
  constructor(
    public id?: number,
    public date?: dayjs.Dayjs | null,
    public transactionId?: IFeeTransactionId | null,
    public eventProductOrder?: IEventProductOrder | null,
    public eventServiceMapOrder?: IEventServiceMapOrder | null,
    public event?: IEvent | null,
    public organizationReservation?: IOrganizationReservation | null,
    public entries?: IFeeTransactionEntry[] | null,
    public user?: IUser | null
  ) {}
}

export function getFeeTransactionIdentifier(feeTransaction: IFeeTransaction): number | undefined {
  return feeTransaction.id;
}
