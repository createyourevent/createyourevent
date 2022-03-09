import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISlotListPlum } from '../slot-list-plum.model';
import { SlotListPlumService } from '../service/slot-list-plum.service';

@Component({
  templateUrl: './slot-list-plum-delete-dialog.component.html',
})
export class SlotListPlumDeleteDialogComponent {
  slotListPlum?: ISlotListPlum;

  constructor(protected slotListPlumService: SlotListPlumService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.slotListPlumService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
