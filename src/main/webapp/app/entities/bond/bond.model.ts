import * as dayjs from 'dayjs';
import { IUser } from 'app/entities/user/user.model';
import { IPointsExchange } from 'app/entities/points-exchange/points-exchange.model';

export interface IBond {
  id?: number;
  name?: string | null;
  description?: string | null;
  code?: string | null;
  points?: number | null;
  creationDate?: dayjs.Dayjs | null;
  redemptionDate?: dayjs.Dayjs | null;
  user?: IUser | null;
  pointsExchange?: IPointsExchange | null;
}

export class Bond implements IBond {
  constructor(
    public id?: number,
    public name?: string | null,
    public description?: string | null,
    public code?: string | null,
    public points?: number | null,
    public creationDate?: dayjs.Dayjs | null,
    public redemptionDate?: dayjs.Dayjs | null,
    public user?: IUser | null,
    public pointsExchange?: IPointsExchange | null
  ) {}
}

export function getBondIdentifier(bond: IBond): number | undefined {
  return bond.id;
}
