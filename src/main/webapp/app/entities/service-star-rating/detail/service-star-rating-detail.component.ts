import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IServiceStarRating } from '../service-star-rating.model';

@Component({
  selector: 'jhi-service-star-rating-detail',
  templateUrl: './service-star-rating-detail.component.html',
})
export class ServiceStarRatingDetailComponent implements OnInit {
  serviceStarRating: IServiceStarRating | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ serviceStarRating }) => {
      this.serviceStarRating = serviceStarRating;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
