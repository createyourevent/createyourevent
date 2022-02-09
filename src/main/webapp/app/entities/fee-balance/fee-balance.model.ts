import * as dayjs from 'dayjs';
import { IUser } from 'app/entities/user/user.model';
import { FeeType } from 'app/entities/enumerations/fee-type.model';

export interface IFeeBalance {
  id?: number;
  date?: dayjs.Dayjs | null;
  type?: FeeType | null;
  total?: number | null;
  user?: IUser | null;
}

export class FeeBalance implements IFeeBalance {
  constructor(
    public id?: number,
    public date?: dayjs.Dayjs | null,
    public type?: FeeType | null,
    public total?: number | null,
    public user?: IUser | null
  ) {}
}

export function getFeeBalanceIdentifier(feeBalance: IFeeBalance): number | undefined {
  return feeBalance.id;
}
