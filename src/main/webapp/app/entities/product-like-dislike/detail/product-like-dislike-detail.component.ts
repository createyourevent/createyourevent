import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IProductLikeDislike } from '../product-like-dislike.model';

@Component({
  selector: 'jhi-product-like-dislike-detail',
  templateUrl: './product-like-dislike-detail.component.html',
})
export class ProductLikeDislikeDetailComponent implements OnInit {
  productLikeDislike: IProductLikeDislike | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ productLikeDislike }) => {
      this.productLikeDislike = productLikeDislike;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
