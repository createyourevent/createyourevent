import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IGift } from '../gift.model';
import { GiftService } from '../service/gift.service';

@Component({
  templateUrl: './gift-delete-dialog.component.html',
})
export class GiftDeleteDialogComponent {
  gift?: IGift;

  constructor(protected giftService: GiftService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.giftService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
