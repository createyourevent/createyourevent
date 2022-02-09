import { IRideCosts } from 'app/entities/ride-costs/ride-costs.model';
import { IServiceOffer } from 'app/entities/service-offer/service-offer.model';
import { IEventServiceMapOrder } from 'app/entities/event-service-map-order/event-service-map-order.model';
import { ICreateYourEventService } from 'app/entities/create-your-event-service/create-your-event-service.model';

export interface IServiceMap {
  id?: number;
  title?: string;
  rideCost?: IRideCosts | null;
  serviceOffers?: IServiceOffer[] | null;
  eventServiceMapOrders?: IEventServiceMapOrder[] | null;
  createYourEventService?: ICreateYourEventService | null;
}

export class ServiceMap implements IServiceMap {
  constructor(
    public id?: number,
    public title?: string,
    public rideCost?: IRideCosts | null,
    public serviceOffers?: IServiceOffer[] | null,
    public eventServiceMapOrders?: IEventServiceMapOrder[] | null,
    public createYourEventService?: ICreateYourEventService | null
  ) {}
}

export function getServiceMapIdentifier(serviceMap: IServiceMap): number | undefined {
  return serviceMap.id;
}
