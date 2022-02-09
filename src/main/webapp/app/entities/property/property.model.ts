export interface IProperty {
  id?: number;
  key?: string | null;
  value?: string | null;
}

export class Property implements IProperty {
  constructor(public id?: number, public key?: string | null, public value?: string | null) {}
}

export function getPropertyIdentifier(property: IProperty): number | undefined {
  return property.id;
}
