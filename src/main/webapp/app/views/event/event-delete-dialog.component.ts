import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IEvent } from 'app/entities/event/event.model';
import { EventService } from 'app/entities/event/service/event.service';
import { JhiEventManager } from 'ng-jhipster';




@Component({
  templateUrl: './event-delete-dialog.component.html'
})
export class EventDeleteDialogComponent {
  event?: IEvent;

  constructor(protected eventService: EventService,
              public activeModal: NgbActiveModal,
              protected eventManager: JhiEventManager,
              )
  {
  }

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.eventService.delete(id).subscribe(() => {
      this.eventManager.broadcast('eventListModification');
      this.activeModal.close();
    });
  }
}
