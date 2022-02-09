import { IServiceMap } from 'app/entities/service-map/service-map.model';

export interface IServiceOffer {
  id?: number;
  title?: string;
  description?: string;
  costHour?: number;
  serviceMaps?: IServiceMap | null;
}

export class ServiceOffer implements IServiceOffer {
  constructor(
    public id?: number,
    public title?: string,
    public description?: string,
    public costHour?: number,
    public serviceMaps?: IServiceMap | null
  ) {}
}

export function getServiceOfferIdentifier(serviceOffer: IServiceOffer): number | undefined {
  return serviceOffer.id;
}
