import { IOrganization } from 'app/entities/organization/organization.model';
import { IUser } from 'app/entities/user/user.model';

export interface IHotel {
  id?: number;
  menu?: string | null;
  placesToSleep?: number | null;
  organization?: IOrganization | null;
  user?: IUser | null;
}

export class Hotel implements IHotel {
  constructor(
    public id?: number,
    public menu?: string | null,
    public placesToSleep?: number | null,
    public organization?: IOrganization | null,
    public user?: IUser | null
  ) {}
}

export function getHotelIdentifier(hotel: IHotel): number | undefined {
  return hotel.id;
}
