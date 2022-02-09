import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IEventProductOrder } from '../event-product-order.model';
import { EventProductOrderService } from '../service/event-product-order.service';

@Component({
  templateUrl: './event-product-order-delete-dialog.component.html',
})
export class EventProductOrderDeleteDialogComponent {
  eventProductOrder?: IEventProductOrder;

  constructor(protected eventProductOrderService: EventProductOrderService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.eventProductOrderService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
