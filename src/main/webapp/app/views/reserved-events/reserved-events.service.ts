import { EventEmitter, Injectable, Output } from '@angular/core';
import { IEvent } from 'app/entities/event/event.model';

@Injectable({
  providedIn: 'root'
})
export class ReservedEventsService {

@Output() favoriteRemovedEmitter = new EventEmitter<IEvent>();
@Output() favoriteAddedEmitter = new EventEmitter<IEvent>();

constructor() { }

favoriteRemoved(e: IEvent) {
  this.favoriteRemovedEmitter.emit(e);
}

favoriteAdded(e: IEvent) {
  this.favoriteAddedEmitter.emit(e);
}

}
