import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IServiceLikeDislike } from '../service-like-dislike.model';

@Component({
  selector: 'jhi-service-like-dislike-detail',
  templateUrl: './service-like-dislike-detail.component.html',
})
export class ServiceLikeDislikeDetailComponent implements OnInit {
  serviceLikeDislike: IServiceLikeDislike | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ serviceLikeDislike }) => {
      this.serviceLikeDislike = serviceLikeDislike;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
