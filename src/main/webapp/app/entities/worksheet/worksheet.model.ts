import * as dayjs from 'dayjs';
import { IUser } from 'app/entities/user/user.model';
import { IEvent } from 'app/entities/event/event.model';
import { IProduct } from 'app/entities/product/product.model';
import { WorksheetType } from 'app/entities/enumerations/worksheet-type.model';
import { UserType } from 'app/entities/enumerations/user-type.model';

export interface IWorksheet {
  id?: number;
  description?: string;
  start?: dayjs.Dayjs;
  end?: dayjs.Dayjs;
  costHour?: number;
  total?: number;
  billingType?: WorksheetType | null;
  userType?: UserType | null;
  user?: IUser | null;
  event?: IEvent | null;
  product?: IProduct | null;
}

export class Worksheet implements IWorksheet {
  constructor(
    public id?: number,
    public description?: string,
    public start?: dayjs.Dayjs,
    public end?: dayjs.Dayjs,
    public costHour?: number,
    public total?: number,
    public billingType?: WorksheetType | null,
    public userType?: UserType | null,
    public user?: IUser | null,
    public event?: IEvent | null,
    public product?: IProduct | null
  ) {}
}

export function getWorksheetIdentifier(worksheet: IWorksheet): number | undefined {
  return worksheet.id;
}
