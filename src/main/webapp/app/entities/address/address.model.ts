import { ILocation } from 'app/entities/location/location.model';

export interface IAddress {
  id?: number;
  address?: string | null;
  lat?: number | null;
  lng?: number | null;
  location?: ILocation | null;
}

export class Address implements IAddress {
  constructor(
    public id?: number,
    public address?: string | null,
    public lat?: number | null,
    public lng?: number | null,
    public location?: ILocation | null
  ) {}
}

export function getAddressIdentifier(address: IAddress): number | undefined {
  return address.id;
}
