import { IUser } from 'app/entities/user/user.model';
import { IEvent } from 'app/entities/event/event.model';

export interface ICoupon {
  id?: number;
  title?: string | null;
  value?: number | null;
  description?: string | null;
  couponNr?: string | null;
  used?: boolean | null;
  user?: IUser | null;
  event?: IEvent | null;
}

export class Coupon implements ICoupon {
  constructor(
    public id?: number,
    public title?: string | null,
    public value?: number | null,
    public description?: string | null,
    public couponNr?: string | null,
    public used?: boolean | null,
    public user?: IUser | null,
    public event?: IEvent | null
  ) {
    this.used = this.used ?? false;
  }
}

export function getCouponIdentifier(coupon: ICoupon): number | undefined {
  return coupon.id;
}
