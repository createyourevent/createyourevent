import { IChipsCollectionChips } from 'app/entities/chips-collection-chips/chips-collection-chips.model';

export interface IChips {
  id?: number;
  points?: number | null;
  website?: string | null;
  x?: number | null;
  y?: number | null;
  imageContentType?: string | null;
  image?: string | null;
  color?: string | null;
  chipsCollectionChips?: IChipsCollectionChips[] | null;
}

export class Chips implements IChips {
  constructor(
    public id?: number,
    public points?: number | null,
    public website?: string | null,
    public x?: number | null,
    public y?: number | null,
    public imageContentType?: string | null,
    public image?: string | null,
    public color?: string | null,
    public chipsCollectionChips?: IChipsCollectionChips[] | null
  ) {}
}

export function getChipsIdentifier(chips: IChips): number | undefined {
  return chips.id;
}
