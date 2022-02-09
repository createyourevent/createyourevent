import { IOrganization } from 'app/entities/organization/organization.model';

export interface IBuilding {
  id?: number;
  surface?: number | null;
  organization?: IOrganization | null;
}

export class Building implements IBuilding {
  constructor(public id?: number, public surface?: number | null, public organization?: IOrganization | null) {}
}

export function getBuildingIdentifier(building: IBuilding): number | undefined {
  return building.id;
}
