import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEventProductRating } from '../event-product-rating.model';

@Component({
  selector: 'jhi-event-product-rating-detail',
  templateUrl: './event-product-rating-detail.component.html',
})
export class EventProductRatingDetailComponent implements OnInit {
  eventProductRating: IEventProductRating | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ eventProductRating }) => {
      this.eventProductRating = eventProductRating;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
