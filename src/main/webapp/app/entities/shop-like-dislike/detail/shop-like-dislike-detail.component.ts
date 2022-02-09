import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IShopLikeDislike } from '../shop-like-dislike.model';

@Component({
  selector: 'jhi-shop-like-dislike-detail',
  templateUrl: './shop-like-dislike-detail.component.html',
})
export class ShopLikeDislikeDetailComponent implements OnInit {
  shopLikeDislike: IShopLikeDislike | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ shopLikeDislike }) => {
      this.shopLikeDislike = shopLikeDislike;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
