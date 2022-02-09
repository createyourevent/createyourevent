import * as dayjs from 'dayjs';
import { IUser } from 'app/entities/user/user.model';
import { IFeeTransaction } from 'app/entities/fee-transaction/fee-transaction.model';
import { IEvent } from 'app/entities/event/event.model';
import { IProduct } from 'app/entities/product/product.model';
import { IShop } from 'app/entities/shop/shop.model';
import { ICart } from 'app/entities/cart/cart.model';
import { IDeliveryType } from 'app/entities/delivery-type/delivery-type.model';
import { RentStatus } from 'app/entities/enumerations/rent-status.model';

export interface IEventProductOrder {
  id?: number;
  amount?: number | null;
  total?: number | null;
  date?: dayjs.Dayjs | null;
  rentalPeriod?: number | null;
  dateFrom?: dayjs.Dayjs | null;
  dateUntil?: dayjs.Dayjs | null;
  status?: RentStatus | null;
  billed?: boolean | null;
  seen?: boolean | null;
  approved?: boolean | null;
  sellingPrice?: number | null;
  user?: IUser | null;
  feeTransaction?: IFeeTransaction | null;
  event?: IEvent | null;
  product?: IProduct | null;
  shop?: IShop | null;
  cart?: ICart | null;
  deliveryType?: IDeliveryType | null;
}

export class EventProductOrder implements IEventProductOrder {
  constructor(
    public id?: number,
    public amount?: number | null,
    public total?: number | null,
    public date?: dayjs.Dayjs | null,
    public rentalPeriod?: number | null,
    public dateFrom?: dayjs.Dayjs | null,
    public dateUntil?: dayjs.Dayjs | null,
    public status?: RentStatus | null,
    public billed?: boolean | null,
    public seen?: boolean | null,
    public approved?: boolean | null,
    public sellingPrice?: number | null,
    public user?: IUser | null,
    public feeTransaction?: IFeeTransaction | null,
    public event?: IEvent | null,
    public product?: IProduct | null,
    public shop?: IShop | null,
    public cart?: ICart | null,
    public deliveryType?: IDeliveryType | null
  ) {
    this.billed = this.billed ?? false;
    this.seen = this.seen ?? false;
    this.approved = this.approved ?? false;
  }
}

export function getEventProductOrderIdentifier(eventProductOrder: IEventProductOrder): number | undefined {
  return eventProductOrder.id;
}
