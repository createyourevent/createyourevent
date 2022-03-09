import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISlotListOrange } from '../slot-list-orange.model';
import { SlotListOrangeService } from '../service/slot-list-orange.service';

@Component({
  templateUrl: './slot-list-orange-delete-dialog.component.html',
})
export class SlotListOrangeDeleteDialogComponent {
  slotListOrange?: ISlotListOrange;

  constructor(protected slotListOrangeService: SlotListOrangeService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.slotListOrangeService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
