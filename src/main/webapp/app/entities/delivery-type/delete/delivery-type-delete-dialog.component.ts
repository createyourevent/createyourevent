import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IDeliveryType } from '../delivery-type.model';
import { DeliveryTypeService } from '../service/delivery-type.service';

@Component({
  templateUrl: './delivery-type-delete-dialog.component.html',
})
export class DeliveryTypeDeleteDialogComponent {
  deliveryType?: IDeliveryType;

  constructor(protected deliveryTypeService: DeliveryTypeService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.deliveryTypeService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
