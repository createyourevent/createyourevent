import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IServiceStarRating } from '../service-star-rating.model';
import { ServiceStarRatingService } from '../service/service-star-rating.service';

@Component({
  templateUrl: './service-star-rating-delete-dialog.component.html',
})
export class ServiceStarRatingDeleteDialogComponent {
  serviceStarRating?: IServiceStarRating;

  constructor(protected serviceStarRatingService: ServiceStarRatingService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.serviceStarRatingService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
