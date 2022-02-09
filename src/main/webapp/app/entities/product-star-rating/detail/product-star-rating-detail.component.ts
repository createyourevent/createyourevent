import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IProductStarRating } from '../product-star-rating.model';

@Component({
  selector: 'jhi-product-star-rating-detail',
  templateUrl: './product-star-rating-detail.component.html',
})
export class ProductStarRatingDetailComponent implements OnInit {
  productStarRating: IProductStarRating | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ productStarRating }) => {
      this.productStarRating = productStarRating;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
