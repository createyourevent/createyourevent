import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEventStarRating } from '../event-star-rating.model';

@Component({
  selector: 'jhi-event-star-rating-detail',
  templateUrl: './event-star-rating-detail.component.html',
})
export class EventStarRatingDetailComponent implements OnInit {
  eventStarRating: IEventStarRating | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ eventStarRating }) => {
      this.eventStarRating = eventStarRating;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
