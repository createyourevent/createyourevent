import { IUser } from 'app/entities/user/user.model';
import { IChipsCollectionChips } from 'app/entities/chips-collection-chips/chips-collection-chips.model';

export interface IChipsCollection {
  id?: number;
  user?: IUser | null;
  chipsCollectionChips?: IChipsCollectionChips[] | null;
}

export class ChipsCollection implements IChipsCollection {
  constructor(public id?: number, public user?: IUser | null, public chipsCollectionChips?: IChipsCollectionChips[] | null) {}
}

export function getChipsCollectionIdentifier(chipsCollection: IChipsCollection): number | undefined {
  return chipsCollection.id;
}
