import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IServiceComment } from '../service-comment.model';

@Component({
  selector: 'jhi-service-comment-detail',
  templateUrl: './service-comment-detail.component.html',
})
export class ServiceCommentDetailComponent implements OnInit {
  serviceComment: IServiceComment | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ serviceComment }) => {
      this.serviceComment = serviceComment;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
