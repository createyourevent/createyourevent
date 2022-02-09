import * as dayjs from 'dayjs';
import { ILocation } from 'app/entities/location/location.model';
import { IEventDetails } from 'app/entities/event-details/event-details.model';
import { IEventProductOrder } from 'app/entities/event-product-order/event-product-order.model';
import { IReservation } from 'app/entities/reservation/reservation.model';
import { IEventProductRatingComment } from 'app/entities/event-product-rating-comment/event-product-rating-comment.model';
import { IWorksheet } from 'app/entities/worksheet/worksheet.model';
import { IEventServiceMapOrder } from 'app/entities/event-service-map-order/event-service-map-order.model';
import { IImage } from 'app/entities/image/image.model';
import { IMp3 } from 'app/entities/mp-3/mp-3.model';
import { IUser } from 'app/entities/user/user.model';
import { IFeeTransaction } from 'app/entities/fee-transaction/fee-transaction.model';
import { ITags } from 'app/entities/tags/tags.model';
import { IOrganizationReservation } from 'app/entities/organization-reservation/organization-reservation.model';
import { EventCategory } from 'app/entities/enumerations/event-category.model';
import { EventStatus } from 'app/entities/enumerations/event-status.model';

export interface IEvent {
  id?: number;
  name?: string;
  description?: string;
  dateStart?: dayjs.Dayjs;
  dateEnd?: dayjs.Dayjs;
  category?: EventCategory;
  price?: number;
  flyerContentType?: string | null;
  flyer?: string | null;
  youtube?: string | null;
  privateOrPublic?: string;
  active?: boolean | null;
  minPlacenumber?: number;
  placenumber?: number;
  investment?: number;
  status?: EventStatus | null;
  definitelyConfirmed?: boolean | null;
  motto?: string;
  billed?: boolean | null;
  stars?: number | null;
  billedOrganisator?: boolean | null;
  billedeCreateYourEvent?: boolean | null;
  location?: ILocation | null;
  eventDetail?: IEventDetails | null;
  eventProductOrders?: IEventProductOrder[] | null;
  reservations?: IReservation[] | null;
  comments?: IEventProductRatingComment[] | null;
  worksheets?: IWorksheet[] | null;
  eventServiceMapOrders?: IEventServiceMapOrder[] | null;
  images?: IImage[] | null;
  mp3s?: IMp3[] | null;
  user?: IUser | null;
  reservedUsers?: IUser[] | null;
  feeTransaction?: IFeeTransaction | null;
  tags?: ITags[] | null;
  organizationReservations?: IOrganizationReservation[] | null;
}

export class Event implements IEvent {
  constructor(
    public id?: number,
    public name?: string,
    public description?: string,
    public dateStart?: dayjs.Dayjs,
    public dateEnd?: dayjs.Dayjs,
    public category?: EventCategory,
    public price?: number,
    public flyerContentType?: string | null,
    public flyer?: string | null,
    public youtube?: string | null,
    public privateOrPublic?: string,
    public active?: boolean | null,
    public minPlacenumber?: number,
    public placenumber?: number,
    public investment?: number,
    public status?: EventStatus | null,
    public definitelyConfirmed?: boolean | null,
    public motto?: string,
    public billed?: boolean | null,
    public stars?: number | null,
    public billedOrganisator?: boolean | null,
    public billedeCreateYourEvent?: boolean | null,
    public location?: ILocation | null,
    public eventDetail?: IEventDetails | null,
    public eventProductOrders?: IEventProductOrder[] | null,
    public reservations?: IReservation[] | null,
    public comments?: IEventProductRatingComment[] | null,
    public worksheets?: IWorksheet[] | null,
    public eventServiceMapOrders?: IEventServiceMapOrder[] | null,
    public images?: IImage[] | null,
    public mp3s?: IMp3[] | null,
    public user?: IUser | null,
    public reservedUsers?: IUser[] | null,
    public feeTransaction?: IFeeTransaction | null,
    public tags?: ITags[] | null,
    public organizationReservations?: IOrganizationReservation[] | null
  ) {
    this.active = this.active ?? false;
    this.definitelyConfirmed = this.definitelyConfirmed ?? false;
    this.billed = this.billed ?? false;
    this.billedOrganisator = this.billedOrganisator ?? false;
    this.billedeCreateYourEvent = this.billedeCreateYourEvent ?? false;
  }
}

export function getEventIdentifier(event: IEvent): number | undefined {
  return event.id;
}
