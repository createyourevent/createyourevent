import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IProductComment, ProductComment } from '../product-comment.model';
import { ProductCommentService } from '../service/product-comment.service';
import { IProduct } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/service/product.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-product-comment-update',
  templateUrl: './product-comment-update.component.html',
})
export class ProductCommentUpdateComponent implements OnInit {
  isSaving = false;

  productCommentsSharedCollection: IProductComment[] = [];
  productsSharedCollection: IProduct[] = [];
  usersSharedCollection: IUser[] = [];

  editForm = this.fb.group({
    id: [],
    comment: [],
    date: [],
    product: [],
    user: [],
    productComment: [],
  });

  constructor(
    protected productCommentService: ProductCommentService,
    protected productService: ProductService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    protected fb: UntypedFormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ productComment }) => {
      if (productComment.id === undefined) {
        const today = dayjs().startOf('day');
        productComment.date = today;
      }

      this.updateForm(productComment);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const productComment = this.createFromForm();
    if (productComment.id !== undefined) {
      this.subscribeToSaveResponse(this.productCommentService.update(productComment));
    } else {
      this.subscribeToSaveResponse(this.productCommentService.create(productComment));
    }
  }

  trackProductCommentById(index: number, item: IProductComment): number {
    return item.id!;
  }

  trackProductById(index: number, item: IProduct): number {
    return item.id!;
  }

  trackUserById(index: number, item: IUser): string {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProductComment>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(productComment: IProductComment): void {
    this.editForm.patchValue({
      id: productComment.id,
      comment: productComment.comment,
      date: productComment.date ? productComment.date.format(DATE_TIME_FORMAT) : null,
      product: productComment.product,
      user: productComment.user,
      productComment: productComment.productComment,
    });

    this.productCommentsSharedCollection = this.productCommentService.addProductCommentToCollectionIfMissing(
      this.productCommentsSharedCollection,
      productComment.productComment
    );
    this.productsSharedCollection = this.productService.addProductToCollectionIfMissing(
      this.productsSharedCollection,
      productComment.product
    );
    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, productComment.user);
  }

  protected loadRelationshipsOptions(): void {
    this.productCommentService
      .query()
      .pipe(map((res: HttpResponse<IProductComment[]>) => res.body ?? []))
      .pipe(
        map((productComments: IProductComment[]) =>
          this.productCommentService.addProductCommentToCollectionIfMissing(productComments, this.editForm.get('productComment')!.value)
        )
      )
      .subscribe((productComments: IProductComment[]) => (this.productCommentsSharedCollection = productComments));

    this.productService
      .query()
      .pipe(map((res: HttpResponse<IProduct[]>) => res.body ?? []))
      .pipe(
        map((products: IProduct[]) => this.productService.addProductToCollectionIfMissing(products, this.editForm.get('product')!.value))
      )
      .subscribe((products: IProduct[]) => (this.productsSharedCollection = products));

    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('user')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }

  protected createFromForm(): IProductComment {
    return {
      ...new ProductComment(),
      id: this.editForm.get(['id'])!.value,
      comment: this.editForm.get(['comment'])!.value,
      date: this.editForm.get(['date'])!.value ? dayjs(this.editForm.get(['date'])!.value, DATE_TIME_FORMAT) : undefined,
      product: this.editForm.get(['product'])!.value,
      user: this.editForm.get(['user'])!.value,
      productComment: this.editForm.get(['productComment'])!.value,
    };
  }
}
