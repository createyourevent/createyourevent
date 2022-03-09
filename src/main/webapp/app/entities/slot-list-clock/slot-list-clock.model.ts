export interface ISlotListClock {
  id?: number;
  coupons?: string | null;
}

export class SlotListClock implements ISlotListClock {
  constructor(public id?: number, public coupons?: string | null) {}
}

export function getSlotListClockIdentifier(slotListClock: ISlotListClock): number | undefined {
  return slotListClock.id;
}
