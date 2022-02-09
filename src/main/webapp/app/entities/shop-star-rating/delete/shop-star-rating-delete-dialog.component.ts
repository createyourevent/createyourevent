import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IShopStarRating } from '../shop-star-rating.model';
import { ShopStarRatingService } from '../service/shop-star-rating.service';

@Component({
  templateUrl: './shop-star-rating-delete-dialog.component.html',
})
export class ShopStarRatingDeleteDialogComponent {
  shopStarRating?: IShopStarRating;

  constructor(protected shopStarRatingService: ShopStarRatingService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.shopStarRatingService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
