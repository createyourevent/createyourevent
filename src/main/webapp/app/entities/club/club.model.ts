import { IOrganization } from 'app/entities/organization/organization.model';
import { IUser } from 'app/entities/user/user.model';

export interface IClub {
  id?: number;
  priceCard?: string | null;
  organization?: IOrganization | null;
  user?: IUser | null;
}

export class Club implements IClub {
  constructor(
    public id?: number,
    public priceCard?: string | null,
    public organization?: IOrganization | null,
    public user?: IUser | null
  ) {}
}

export function getClubIdentifier(club: IClub): number | undefined {
  return club.id;
}
