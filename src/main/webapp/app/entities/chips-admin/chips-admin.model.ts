export interface IChipsAdmin {
  id?: number;
  gameActive?: boolean | null;
}

export class ChipsAdmin implements IChipsAdmin {
  constructor(public id?: number, public gameActive?: boolean | null) {
    this.gameActive = this.gameActive ?? false;
  }
}

export function getChipsAdminIdentifier(chipsAdmin: IChipsAdmin): number | undefined {
  return chipsAdmin.id;
}
