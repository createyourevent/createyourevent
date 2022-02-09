import { IOrganization } from 'app/entities/organization/organization.model';
import { IUser } from 'app/entities/user/user.model';

export interface IRestaurant {
  id?: number;
  menu?: string | null;
  organization?: IOrganization | null;
  user?: IUser | null;
}

export class Restaurant implements IRestaurant {
  constructor(public id?: number, public menu?: string | null, public organization?: IOrganization | null, public user?: IUser | null) {}
}

export function getRestaurantIdentifier(restaurant: IRestaurant): number | undefined {
  return restaurant.id;
}
