import { IOrganization } from 'app/entities/organization/organization.model';
import { IUser } from 'app/entities/user/user.model';

export interface IBuilding {
  id?: number;
  surface?: number | null;
  organization?: IOrganization | null;
  user?: IUser | null;
}

export class Building implements IBuilding {
  constructor(public id?: number, public surface?: number | null, public organization?: IOrganization | null, public user?: IUser | null) {}
}

export function getBuildingIdentifier(building: IBuilding): number | undefined {
  return building.id;
}
