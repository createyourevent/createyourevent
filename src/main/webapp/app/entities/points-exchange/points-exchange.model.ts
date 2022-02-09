import { IBond } from 'app/entities/bond/bond.model';

export interface IPointsExchange {
  id?: number;
  pointsTotal?: number | null;
  bondPointsTotal?: number | null;
  bonds?: IBond[] | null;
}

export class PointsExchange implements IPointsExchange {
  constructor(
    public id?: number,
    public pointsTotal?: number | null,
    public bondPointsTotal?: number | null,
    public bonds?: IBond[] | null
  ) {}
}

export function getPointsExchangeIdentifier(pointsExchange: IPointsExchange): number | undefined {
  return pointsExchange.id;
}
