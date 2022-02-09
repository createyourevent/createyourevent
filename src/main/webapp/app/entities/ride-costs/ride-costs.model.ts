import { IServiceMap } from 'app/entities/service-map/service-map.model';

export interface IRideCosts {
  id?: number;
  pricePerKilometre?: number;
  serviceMap?: IServiceMap | null;
}

export class RideCosts implements IRideCosts {
  constructor(public id?: number, public pricePerKilometre?: number, public serviceMap?: IServiceMap | null) {}
}

export function getRideCostsIdentifier(rideCosts: IRideCosts): number | undefined {
  return rideCosts.id;
}
