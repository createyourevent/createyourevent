import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IServiceOffer } from '../service-offer.model';
import { ServiceOfferService } from '../service/service-offer.service';

@Component({
  templateUrl: './service-offer-delete-dialog.component.html',
})
export class ServiceOfferDeleteDialogComponent {
  serviceOffer?: IServiceOffer;

  constructor(protected serviceOfferService: ServiceOfferService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.serviceOfferService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
