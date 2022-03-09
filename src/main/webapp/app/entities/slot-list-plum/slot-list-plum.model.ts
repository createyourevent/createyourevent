export interface ISlotListPlum {
  id?: number;
  coupons?: string | null;
}

export class SlotListPlum implements ISlotListPlum {
  constructor(public id?: number, public coupons?: string | null) {}
}

export function getSlotListPlumIdentifier(slotListPlum: ISlotListPlum): number | undefined {
  return slotListPlum.id;
}
