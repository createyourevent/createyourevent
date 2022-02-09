import * as dayjs from 'dayjs';
import { IOrganization } from 'app/entities/organization/organization.model';
import { IUser } from 'app/entities/user/user.model';

export interface IOrganizationComment {
  id?: number;
  comment?: string | null;
  date?: dayjs.Dayjs | null;
  organizationComments?: IOrganizationComment[] | null;
  organization?: IOrganization | null;
  user?: IUser | null;
  event?: IOrganization | null;
  organizationComment?: IOrganizationComment | null;
}

export class OrganizationComment implements IOrganizationComment {
  constructor(
    public id?: number,
    public comment?: string | null,
    public date?: dayjs.Dayjs | null,
    public organizationComments?: IOrganizationComment[] | null,
    public organization?: IOrganization | null,
    public user?: IUser | null,
    public event?: IOrganization | null,
    public organizationComment?: IOrganizationComment | null
  ) {}
}

export function getOrganizationCommentIdentifier(organizationComment: IOrganizationComment): number | undefined {
  return organizationComment.id;
}
