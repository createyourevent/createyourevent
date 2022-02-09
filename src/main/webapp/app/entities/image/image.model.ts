import { IUser } from 'app/entities/user/user.model';
import { IProduct } from 'app/entities/product/product.model';
import { IShop } from 'app/entities/shop/shop.model';
import { IEvent } from 'app/entities/event/event.model';
import { ICreateYourEventService } from 'app/entities/create-your-event-service/create-your-event-service.model';
import { IOrganization } from 'app/entities/organization/organization.model';

export interface IImage {
  id?: number;
  name?: string | null;
  imageContentType?: string | null;
  image?: string | null;
  user?: IUser | null;
  product?: IProduct | null;
  shop?: IShop | null;
  event?: IEvent | null;
  service?: ICreateYourEventService | null;
  organization?: IOrganization | null;
}

export class Image implements IImage {
  constructor(
    public id?: number,
    public name?: string | null,
    public imageContentType?: string | null,
    public image?: string | null,
    public user?: IUser | null,
    public product?: IProduct | null,
    public shop?: IShop | null,
    public event?: IEvent | null,
    public service?: ICreateYourEventService | null,
    public organization?: IOrganization | null
  ) {}
}

export function getImageIdentifier(image: IImage): number | undefined {
  return image.id;
}
