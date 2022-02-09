import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IShopComment } from '../shop-comment.model';
import { ShopCommentService } from '../service/shop-comment.service';

@Component({
  templateUrl: './shop-comment-delete-dialog.component.html',
})
export class ShopCommentDeleteDialogComponent {
  shopComment?: IShopComment;

  constructor(protected shopCommentService: ShopCommentService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.shopCommentService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
