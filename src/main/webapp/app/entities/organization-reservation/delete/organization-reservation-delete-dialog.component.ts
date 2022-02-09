import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IOrganizationReservation } from '../organization-reservation.model';
import { OrganizationReservationService } from '../service/organization-reservation.service';

@Component({
  templateUrl: './organization-reservation-delete-dialog.component.html',
})
export class OrganizationReservationDeleteDialogComponent {
  organizationReservation?: IOrganizationReservation;

  constructor(protected organizationReservationService: OrganizationReservationService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.organizationReservationService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
