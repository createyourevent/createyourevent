import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IOrganizationStarRating } from '../organization-star-rating.model';
import { OrganizationStarRatingService } from '../service/organization-star-rating.service';

@Component({
  templateUrl: './organization-star-rating-delete-dialog.component.html',
})
export class OrganizationStarRatingDeleteDialogComponent {
  organizationStarRating?: IOrganizationStarRating;

  constructor(protected organizationStarRatingService: OrganizationStarRatingService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.organizationStarRatingService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
