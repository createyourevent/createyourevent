import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IProductComment } from '../product-comment.model';

@Component({
  selector: 'jhi-product-comment-detail',
  templateUrl: './product-comment-detail.component.html',
})
export class ProductCommentDetailComponent implements OnInit {
  productComment: IProductComment | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ productComment }) => {
      this.productComment = productComment;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
