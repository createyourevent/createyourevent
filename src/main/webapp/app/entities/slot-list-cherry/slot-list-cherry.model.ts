export interface ISlotListCherry {
  id?: number;
  coupons?: string | null;
}

export class SlotListCherry implements ISlotListCherry {
  constructor(public id?: number, public coupons?: string | null) {}
}

export function getSlotListCherryIdentifier(slotListCherry: ISlotListCherry): number | undefined {
  return slotListCherry.id;
}
