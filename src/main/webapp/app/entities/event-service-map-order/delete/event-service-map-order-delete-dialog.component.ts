import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IEventServiceMapOrder } from '../event-service-map-order.model';
import { EventServiceMapOrderService } from '../service/event-service-map-order.service';

@Component({
  templateUrl: './event-service-map-order-delete-dialog.component.html',
})
export class EventServiceMapOrderDeleteDialogComponent {
  eventServiceMapOrder?: IEventServiceMapOrder;

  constructor(protected eventServiceMapOrderService: EventServiceMapOrderService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.eventServiceMapOrderService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
