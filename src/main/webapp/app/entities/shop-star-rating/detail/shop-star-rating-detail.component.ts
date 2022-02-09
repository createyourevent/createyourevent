import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IShopStarRating } from '../shop-star-rating.model';

@Component({
  selector: 'jhi-shop-star-rating-detail',
  templateUrl: './shop-star-rating-detail.component.html',
})
export class ShopStarRatingDetailComponent implements OnInit {
  shopStarRating: IShopStarRating | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ shopStarRating }) => {
      this.shopStarRating = shopStarRating;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
