import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IEventLikeDislike } from '../event-like-dislike.model';
import { EventLikeDislikeService } from '../service/event-like-dislike.service';

@Component({
  templateUrl: './event-like-dislike-delete-dialog.component.html',
})
export class EventLikeDislikeDeleteDialogComponent {
  eventLikeDislike?: IEventLikeDislike;

  constructor(protected eventLikeDislikeService: EventLikeDislikeService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.eventLikeDislikeService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
