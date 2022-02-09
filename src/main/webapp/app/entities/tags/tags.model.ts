import { IEvent } from 'app/entities/event/event.model';
import { IProduct } from 'app/entities/product/product.model';
import { IShop } from 'app/entities/shop/shop.model';
import { ICreateYourEventService } from 'app/entities/create-your-event-service/create-your-event-service.model';
import { IOrganization } from 'app/entities/organization/organization.model';

export interface ITags {
  id?: number;
  tag?: string | null;
  event?: IEvent | null;
  product?: IProduct | null;
  shop?: IShop | null;
  service?: ICreateYourEventService | null;
  organization?: IOrganization | null;
}

export class Tags implements ITags {
  constructor(
    public id?: number,
    public tag?: string | null,
    public event?: IEvent | null,
    public product?: IProduct | null,
    public shop?: IShop | null,
    public service?: ICreateYourEventService | null,
    public organization?: IOrganization | null
  ) {}
}

export function getTagsIdentifier(tags: ITags): number | undefined {
  return tags.id;
}
