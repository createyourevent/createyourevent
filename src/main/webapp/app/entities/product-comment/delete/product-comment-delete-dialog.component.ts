import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IProductComment } from '../product-comment.model';
import { ProductCommentService } from '../service/product-comment.service';

@Component({
  templateUrl: './product-comment-delete-dialog.component.html',
})
export class ProductCommentDeleteDialogComponent {
  productComment?: IProductComment;

  constructor(protected productCommentService: ProductCommentService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.productCommentService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
