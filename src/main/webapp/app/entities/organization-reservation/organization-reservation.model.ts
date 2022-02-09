import * as dayjs from 'dayjs';
import { IUser } from 'app/entities/user/user.model';
import { IEvent } from 'app/entities/event/event.model';
import { IFeeTransaction } from 'app/entities/fee-transaction/fee-transaction.model';
import { IOrganization } from 'app/entities/organization/organization.model';

export interface IOrganizationReservation {
  id?: number;
  date?: dayjs.Dayjs | null;
  dateFrom?: dayjs.Dayjs | null;
  dateUntil?: dayjs.Dayjs | null;
  seen?: boolean | null;
  approved?: boolean | null;
  total?: number | null;
  feeBilled?: boolean | null;
  user?: IUser | null;
  event?: IEvent | null;
  feeTransaction?: IFeeTransaction | null;
  organization?: IOrganization | null;
}

export class OrganizationReservation implements IOrganizationReservation {
  constructor(
    public id?: number,
    public date?: dayjs.Dayjs | null,
    public dateFrom?: dayjs.Dayjs | null,
    public dateUntil?: dayjs.Dayjs | null,
    public seen?: boolean | null,
    public approved?: boolean | null,
    public total?: number | null,
    public feeBilled?: boolean | null,
    public user?: IUser | null,
    public event?: IEvent | null,
    public feeTransaction?: IFeeTransaction | null,
    public organization?: IOrganization | null
  ) {
    this.seen = this.seen ?? false;
    this.approved = this.approved ?? false;
    this.feeBilled = this.feeBilled ?? false;
  }
}

export function getOrganizationReservationIdentifier(organizationReservation: IOrganizationReservation): number | undefined {
  return organizationReservation.id;
}
