import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IEventComment } from '../event-comment.model';
import { EventCommentService } from '../service/event-comment.service';

@Component({
  templateUrl: './event-comment-delete-dialog.component.html',
})
export class EventCommentDeleteDialogComponent {
  eventComment?: IEventComment;

  constructor(protected eventCommentService: EventCommentService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.eventCommentService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
