import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IProductLikeDislike } from '../product-like-dislike.model';
import { ProductLikeDislikeService } from '../service/product-like-dislike.service';

@Component({
  templateUrl: './product-like-dislike-delete-dialog.component.html',
})
export class ProductLikeDislikeDeleteDialogComponent {
  productLikeDislike?: IProductLikeDislike;

  constructor(protected productLikeDislikeService: ProductLikeDislikeService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.productLikeDislikeService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
