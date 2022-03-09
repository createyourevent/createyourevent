export interface ISlotListOrange {
  id?: number;
  coupons?: string | null;
}

export class SlotListOrange implements ISlotListOrange {
  constructor(public id?: number, public coupons?: string | null) {}
}

export function getSlotListOrangeIdentifier(slotListOrange: ISlotListOrange): number | undefined {
  return slotListOrange.id;
}
