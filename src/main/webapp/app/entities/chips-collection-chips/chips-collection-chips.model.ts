import { IChipsCollection } from 'app/entities/chips-collection/chips-collection.model';
import { IChips } from 'app/entities/chips/chips.model';

export interface IChipsCollectionChips {
  id?: number;
  chipsCollection?: IChipsCollection | null;
  chips?: IChips | null;
}

export class ChipsCollectionChips implements IChipsCollectionChips {
  constructor(public id?: number, public chipsCollection?: IChipsCollection | null, public chips?: IChips | null) {}
}

export function getChipsCollectionChipsIdentifier(chipsCollectionChips: IChipsCollectionChips): number | undefined {
  return chipsCollectionChips.id;
}
