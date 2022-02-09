import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IShopComment } from '../shop-comment.model';

@Component({
  selector: 'jhi-shop-comment-detail',
  templateUrl: './shop-comment-detail.component.html',
})
export class ShopCommentDetailComponent implements OnInit {
  shopComment: IShopComment | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ shopComment }) => {
      this.shopComment = shopComment;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
