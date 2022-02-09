import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IProductStarRating } from '../product-star-rating.model';
import { ProductStarRatingService } from '../service/product-star-rating.service';

@Component({
  templateUrl: './product-star-rating-delete-dialog.component.html',
})
export class ProductStarRatingDeleteDialogComponent {
  productStarRating?: IProductStarRating;

  constructor(protected productStarRatingService: ProductStarRatingService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.productStarRatingService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
