import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IFeeTransaction } from '../fee-transaction.model';
import { FeeTransactionService } from '../service/fee-transaction.service';

@Component({
  templateUrl: './fee-transaction-delete-dialog.component.html',
})
export class FeeTransactionDeleteDialogComponent {
  feeTransaction?: IFeeTransaction;

  constructor(protected feeTransactionService: FeeTransactionService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.feeTransactionService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
