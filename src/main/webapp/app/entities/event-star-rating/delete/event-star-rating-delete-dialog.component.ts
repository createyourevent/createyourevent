import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IEventStarRating } from '../event-star-rating.model';
import { EventStarRatingService } from '../service/event-star-rating.service';

@Component({
  templateUrl: './event-star-rating-delete-dialog.component.html',
})
export class EventStarRatingDeleteDialogComponent {
  eventStarRating?: IEventStarRating;

  constructor(protected eventStarRatingService: EventStarRatingService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.eventStarRatingService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
