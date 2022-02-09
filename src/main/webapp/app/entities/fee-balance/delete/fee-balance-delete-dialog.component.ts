import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IFeeBalance } from '../fee-balance.model';
import { FeeBalanceService } from '../service/fee-balance.service';

@Component({
  templateUrl: './fee-balance-delete-dialog.component.html',
})
export class FeeBalanceDeleteDialogComponent {
  feeBalance?: IFeeBalance;

  constructor(protected feeBalanceService: FeeBalanceService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.feeBalanceService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
