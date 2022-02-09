import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IEventProductRatingComment } from '../event-product-rating-comment.model';
import { EventProductRatingCommentService } from '../service/event-product-rating-comment.service';

@Component({
  templateUrl: './event-product-rating-comment-delete-dialog.component.html',
})
export class EventProductRatingCommentDeleteDialogComponent {
  eventProductRatingComment?: IEventProductRatingComment;

  constructor(protected eventProductRatingCommentService: EventProductRatingCommentService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.eventProductRatingCommentService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
