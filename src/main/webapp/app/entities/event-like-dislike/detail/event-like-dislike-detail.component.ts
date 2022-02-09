import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEventLikeDislike } from '../event-like-dislike.model';

@Component({
  selector: 'jhi-event-like-dislike-detail',
  templateUrl: './event-like-dislike-detail.component.html',
})
export class EventLikeDislikeDetailComponent implements OnInit {
  eventLikeDislike: IEventLikeDislike | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ eventLikeDislike }) => {
      this.eventLikeDislike = eventLikeDislike;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
