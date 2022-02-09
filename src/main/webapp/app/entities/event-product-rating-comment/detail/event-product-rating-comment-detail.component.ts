import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEventProductRatingComment } from '../event-product-rating-comment.model';

@Component({
  selector: 'jhi-event-product-rating-comment-detail',
  templateUrl: './event-product-rating-comment-detail.component.html',
})
export class EventProductRatingCommentDetailComponent implements OnInit {
  eventProductRatingComment: IEventProductRatingComment | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ eventProductRatingComment }) => {
      this.eventProductRatingComment = eventProductRatingComment;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
