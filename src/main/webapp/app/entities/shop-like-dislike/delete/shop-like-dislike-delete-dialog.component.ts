import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IShopLikeDislike } from '../shop-like-dislike.model';
import { ShopLikeDislikeService } from '../service/shop-like-dislike.service';

@Component({
  templateUrl: './shop-like-dislike-delete-dialog.component.html',
})
export class ShopLikeDislikeDeleteDialogComponent {
  shopLikeDislike?: IShopLikeDislike;

  constructor(protected shopLikeDislikeService: ShopLikeDislikeService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.shopLikeDislikeService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
