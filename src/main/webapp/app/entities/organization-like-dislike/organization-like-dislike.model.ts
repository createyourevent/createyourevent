import * as dayjs from 'dayjs';
import { IOrganization } from 'app/entities/organization/organization.model';
import { IUser } from 'app/entities/user/user.model';

export interface IOrganizationLikeDislike {
  id?: number;
  like?: number | null;
  dislike?: number | null;
  date?: dayjs.Dayjs | null;
  comment?: string | null;
  organization?: IOrganization | null;
  event?: IOrganization | null;
  user?: IUser | null;
}

export class OrganizationLikeDislike implements IOrganizationLikeDislike {
  constructor(
    public id?: number,
    public like?: number | null,
    public dislike?: number | null,
    public date?: dayjs.Dayjs | null,
    public comment?: string | null,
    public organization?: IOrganization | null,
    public event?: IOrganization | null,
    public user?: IUser | null
  ) {}
}

export function getOrganizationLikeDislikeIdentifier(organizationLikeDislike: IOrganizationLikeDislike): number | undefined {
  return organizationLikeDislike.id;
}
