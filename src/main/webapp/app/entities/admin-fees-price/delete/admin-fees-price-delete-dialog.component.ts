import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAdminFeesPrice } from '../admin-fees-price.model';
import { AdminFeesPriceService } from '../service/admin-fees-price.service';

@Component({
  templateUrl: './admin-fees-price-delete-dialog.component.html',
})
export class AdminFeesPriceDeleteDialogComponent {
  adminFeesPrice?: IAdminFeesPrice;

  constructor(protected adminFeesPriceService: AdminFeesPriceService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.adminFeesPriceService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
