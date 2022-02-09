import { IUser } from 'app/entities/user/user.model';
import { IProduct } from 'app/entities/product/product.model';
import { IShop } from 'app/entities/shop/shop.model';
import { IEvent } from 'app/entities/event/event.model';
import { ICreateYourEventService } from 'app/entities/create-your-event-service/create-your-event-service.model';

export interface IMp3 {
  id?: number;
  title?: string | null;
  artists?: string | null;
  duration?: number | null;
  url?: string | null;
  user?: IUser | null;
  product?: IProduct | null;
  shop?: IShop | null;
  event?: IEvent | null;
  service?: ICreateYourEventService | null;
}

export class Mp3 implements IMp3 {
  constructor(
    public id?: number,
    public title?: string | null,
    public artists?: string | null,
    public duration?: number | null,
    public url?: string | null,
    public user?: IUser | null,
    public product?: IProduct | null,
    public shop?: IShop | null,
    public event?: IEvent | null,
    public service?: ICreateYourEventService | null
  ) {}
}

export function getMp3Identifier(mp3: IMp3): number | undefined {
  return mp3.id;
}
