import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISlotListClock } from '../slot-list-clock.model';
import { SlotListClockService } from '../service/slot-list-clock.service';

@Component({
  templateUrl: './slot-list-clock-delete-dialog.component.html',
})
export class SlotListClockDeleteDialogComponent {
  slotListClock?: ISlotListClock;

  constructor(protected slotListClockService: SlotListClockService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.slotListClockService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
