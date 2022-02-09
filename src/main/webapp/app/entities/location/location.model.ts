import { IAddress } from 'app/entities/address/address.model';
import { IEvent } from 'app/entities/event/event.model';

export interface ILocation {
  id?: number;
  name?: string;
  description?: string;
  photoContentType?: string | null;
  photo?: string | null;
  address?: IAddress | null;
  event?: IEvent | null;
}

export class Location implements ILocation {
  constructor(
    public id?: number,
    public name?: string,
    public description?: string,
    public photoContentType?: string | null,
    public photo?: string | null,
    public address?: IAddress | null,
    public event?: IEvent | null
  ) {}
}

export function getLocationIdentifier(location: ILocation): number | undefined {
  return location.id;
}
