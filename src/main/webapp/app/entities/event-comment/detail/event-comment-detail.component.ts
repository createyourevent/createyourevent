import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEventComment } from '../event-comment.model';

@Component({
  selector: 'jhi-event-comment-detail',
  templateUrl: './event-comment-detail.component.html',
})
export class EventCommentDetailComponent implements OnInit {
  eventComment: IEventComment | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ eventComment }) => {
      this.eventComment = eventComment;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
