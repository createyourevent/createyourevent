import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IEventDetails } from '../event-details.model';
import { EventDetailsService } from '../service/event-details.service';

@Component({
  templateUrl: './event-details-delete-dialog.component.html',
})
export class EventDetailsDeleteDialogComponent {
  eventDetails?: IEventDetails;

  constructor(protected eventDetailsService: EventDetailsService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.eventDetailsService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
