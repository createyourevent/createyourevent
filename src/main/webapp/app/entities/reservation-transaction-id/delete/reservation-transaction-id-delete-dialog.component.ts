import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IReservationTransactionId } from '../reservation-transaction-id.model';
import { ReservationTransactionIdService } from '../service/reservation-transaction-id.service';

@Component({
  templateUrl: './reservation-transaction-id-delete-dialog.component.html',
})
export class ReservationTransactionIdDeleteDialogComponent {
  reservationTransactionId?: IReservationTransactionId;

  constructor(protected reservationTransactionIdService: ReservationTransactionIdService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.reservationTransactionIdService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
