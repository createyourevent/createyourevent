import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IFeeTransactionId } from '../fee-transaction-id.model';
import { FeeTransactionIdService } from '../service/fee-transaction-id.service';

@Component({
  templateUrl: './fee-transaction-id-delete-dialog.component.html',
})
export class FeeTransactionIdDeleteDialogComponent {
  feeTransactionId?: IFeeTransactionId;

  constructor(protected feeTransactionIdService: FeeTransactionIdService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.feeTransactionIdService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
