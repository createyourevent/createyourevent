import * as dayjs from 'dayjs';
import { IFeeTransaction } from 'app/entities/fee-transaction/fee-transaction.model';
import { IEvent } from 'app/entities/event/event.model';
import { IServiceMap } from 'app/entities/service-map/service-map.model';
import { ICart } from 'app/entities/cart/cart.model';

export interface IEventServiceMapOrder {
  id?: number;
  date?: dayjs.Dayjs | null;
  dateFrom?: dayjs.Dayjs | null;
  dateUntil?: dayjs.Dayjs | null;
  costHour?: number | null;
  rideCosts?: number | null;
  total?: number | null;
  totalHours?: string | null;
  kilometre?: number | null;
  billed?: boolean | null;
  seen?: boolean | null;
  approved?: boolean | null;
  feeTransaction?: IFeeTransaction | null;
  event?: IEvent | null;
  serviceMap?: IServiceMap | null;
  cart?: ICart | null;
}

export class EventServiceMapOrder implements IEventServiceMapOrder {
  constructor(
    public id?: number,
    public date?: dayjs.Dayjs | null,
    public dateFrom?: dayjs.Dayjs | null,
    public dateUntil?: dayjs.Dayjs | null,
    public costHour?: number | null,
    public rideCosts?: number | null,
    public total?: number | null,
    public totalHours?: string | null,
    public kilometre?: number | null,
    public billed?: boolean | null,
    public seen?: boolean | null,
    public approved?: boolean | null,
    public feeTransaction?: IFeeTransaction | null,
    public event?: IEvent | null,
    public serviceMap?: IServiceMap | null,
    public cart?: ICart | null
  ) {
    this.billed = this.billed ?? false;
    this.seen = this.seen ?? false;
    this.approved = this.approved ?? false;
  }
}

export function getEventServiceMapOrderIdentifier(eventServiceMapOrder: IEventServiceMapOrder): number | undefined {
  return eventServiceMapOrder.id;
}
