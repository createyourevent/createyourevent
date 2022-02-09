import * as dayjs from 'dayjs';
import { IEventProductOrder } from 'app/entities/event-product-order/event-product-order.model';
import { IEventServiceMapOrder } from 'app/entities/event-service-map-order/event-service-map-order.model';

export interface ICart {
  id?: number;
  date?: dayjs.Dayjs | null;
  totalCosts?: number | null;
  products?: IEventProductOrder[] | null;
  services?: IEventServiceMapOrder[] | null;
}

export class Cart implements ICart {
  constructor(
    public id?: number,
    public date?: dayjs.Dayjs | null,
    public totalCosts?: number | null,
    public products?: IEventProductOrder[] | null,
    public services?: IEventServiceMapOrder[] | null
  ) {}
}

export function getCartIdentifier(cart: ICart): number | undefined {
  return cart.id;
}
