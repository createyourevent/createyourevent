import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IFeeTransactionEntry } from '../fee-transaction-entry.model';
import { FeeTransactionEntryService } from '../service/fee-transaction-entry.service';

@Component({
  templateUrl: './fee-transaction-entry-delete-dialog.component.html',
})
export class FeeTransactionEntryDeleteDialogComponent {
  feeTransactionEntry?: IFeeTransactionEntry;

  constructor(protected feeTransactionEntryService: FeeTransactionEntryService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.feeTransactionEntryService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
