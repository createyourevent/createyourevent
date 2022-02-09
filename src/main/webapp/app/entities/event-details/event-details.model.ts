import { IEvent } from 'app/entities/event/event.model';

export interface IEventDetails {
  id?: number;
  totalEntranceFee?: number | null;
  event?: IEvent | null;
}

export class EventDetails implements IEventDetails {
  constructor(public id?: number, public totalEntranceFee?: number | null, public event?: IEvent | null) {}
}

export function getEventDetailsIdentifier(eventDetails: IEventDetails): number | undefined {
  return eventDetails.id;
}
