import * as dayjs from 'dayjs';
import { OrderStatus } from 'app/entities/enumerations/order-status.model';

export interface IOrder {
  id?: number;
  status?: OrderStatus | null;
  dateAdded?: dayjs.Dayjs | null;
}

export class Order implements IOrder {
  constructor(public id?: number, public status?: OrderStatus | null, public dateAdded?: dayjs.Dayjs | null) {}
}

export function getOrderIdentifier(order: IOrder): number | undefined {
  return order.id;
}
