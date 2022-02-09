import { IImage } from 'app/entities/image/image.model';
import { IOrganizationReservation } from 'app/entities/organization-reservation/organization-reservation.model';
import { IUser } from 'app/entities/user/user.model';
import { IRestaurant } from 'app/entities/restaurant/restaurant.model';
import { IHotel } from 'app/entities/hotel/hotel.model';
import { IClub } from 'app/entities/club/club.model';
import { IBuilding } from 'app/entities/building/building.model';
import { ITags } from 'app/entities/tags/tags.model';
import { OrganizationType } from 'app/entities/enumerations/organization-type.model';
import { RentType } from 'app/entities/enumerations/rent-type.model';

export interface IOrganization {
  id?: number;
  name?: string;
  organizationType?: OrganizationType;
  logoContentType?: string | null;
  logo?: string | null;
  active?: boolean | null;
  activeOwner?: boolean | null;
  description?: string;
  address?: string;
  motto?: string;
  phone?: string;
  webAddress?: string | null;
  placeNumber?: number | null;
  price?: number | null;
  rentType?: RentType | null;
  images?: IImage[] | null;
  organizationReservations?: IOrganizationReservation[] | null;
  user?: IUser | null;
  restaurant?: IRestaurant | null;
  hotel?: IHotel | null;
  club?: IClub | null;
  building?: IBuilding | null;
  tags?: ITags[] | null;
}

export class Organization implements IOrganization {
  constructor(
    public id?: number,
    public name?: string,
    public organizationType?: OrganizationType,
    public logoContentType?: string | null,
    public logo?: string | null,
    public active?: boolean | null,
    public activeOwner?: boolean | null,
    public description?: string,
    public address?: string,
    public motto?: string,
    public phone?: string,
    public webAddress?: string | null,
    public placeNumber?: number | null,
    public price?: number | null,
    public rentType?: RentType | null,
    public images?: IImage[] | null,
    public organizationReservations?: IOrganizationReservation[] | null,
    public user?: IUser | null,
    public restaurant?: IRestaurant | null,
    public hotel?: IHotel | null,
    public club?: IClub | null,
    public building?: IBuilding | null,
    public tags?: ITags[] | null
  ) {
    this.active = this.active ?? false;
    this.activeOwner = this.activeOwner ?? false;
  }
}

export function getOrganizationIdentifier(organization: IOrganization): number | undefined {
  return organization.id;
}
