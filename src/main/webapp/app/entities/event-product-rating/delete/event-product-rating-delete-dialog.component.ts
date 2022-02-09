import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IEventProductRating } from '../event-product-rating.model';
import { EventProductRatingService } from '../service/event-product-rating.service';

@Component({
  templateUrl: './event-product-rating-delete-dialog.component.html',
})
export class EventProductRatingDeleteDialogComponent {
  eventProductRating?: IEventProductRating;

  constructor(protected eventProductRatingService: EventProductRatingService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.eventProductRatingService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
