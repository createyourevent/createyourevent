import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISlotListCherry } from '../slot-list-cherry.model';
import { SlotListCherryService } from '../service/slot-list-cherry.service';

@Component({
  templateUrl: './slot-list-cherry-delete-dialog.component.html',
})
export class SlotListCherryDeleteDialogComponent {
  slotListCherry?: ISlotListCherry;

  constructor(protected slotListCherryService: SlotListCherryService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.slotListCherryService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
