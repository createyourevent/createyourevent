import * as dayjs from 'dayjs';
import { IOrganization } from 'app/entities/organization/organization.model';
import { IUser } from 'app/entities/user/user.model';

export interface IOrganizationStarRating {
  id?: number;
  stars?: number | null;
  date?: dayjs.Dayjs | null;
  comment?: string | null;
  organization?: IOrganization | null;
  user?: IUser | null;
}

export class OrganizationStarRating implements IOrganizationStarRating {
  constructor(
    public id?: number,
    public stars?: number | null,
    public date?: dayjs.Dayjs | null,
    public comment?: string | null,
    public organization?: IOrganization | null,
    public user?: IUser | null
  ) {}
}

export function getOrganizationStarRatingIdentifier(organizationStarRating: IOrganizationStarRating): number | undefined {
  return organizationStarRating.id;
}
