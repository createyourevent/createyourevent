import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IBond } from '../bond.model';
import { BondService } from '../service/bond.service';

@Component({
  templateUrl: './bond-delete-dialog.component.html',
})
export class BondDeleteDialogComponent {
  bond?: IBond;

  constructor(protected bondService: BondService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.bondService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
