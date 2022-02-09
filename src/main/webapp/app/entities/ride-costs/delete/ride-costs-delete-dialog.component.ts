import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IRideCosts } from '../ride-costs.model';
import { RideCostsService } from '../service/ride-costs.service';

@Component({
  templateUrl: './ride-costs-delete-dialog.component.html',
})
export class RideCostsDeleteDialogComponent {
  rideCosts?: IRideCosts;

  constructor(protected rideCostsService: RideCostsService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.rideCostsService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
