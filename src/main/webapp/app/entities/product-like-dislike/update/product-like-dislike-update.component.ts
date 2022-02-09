import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IProductLikeDislike, ProductLikeDislike } from '../product-like-dislike.model';
import { ProductLikeDislikeService } from '../service/product-like-dislike.service';
import { IProduct } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/service/product.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-product-like-dislike-update',
  templateUrl: './product-like-dislike-update.component.html',
})
export class ProductLikeDislikeUpdateComponent implements OnInit {
  isSaving = false;

  productsSharedCollection: IProduct[] = [];
  usersSharedCollection: IUser[] = [];

  editForm = this.fb.group({
    id: [],
    like: [],
    dislike: [],
    date: [],
    comment: [],
    product: [],
    user: [],
  });

  constructor(
    protected productLikeDislikeService: ProductLikeDislikeService,
    protected productService: ProductService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ productLikeDislike }) => {
      if (productLikeDislike.id === undefined) {
        const today = dayjs().startOf('day');
        productLikeDislike.date = today;
      }

      this.updateForm(productLikeDislike);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const productLikeDislike = this.createFromForm();
    if (productLikeDislike.id !== undefined) {
      this.subscribeToSaveResponse(this.productLikeDislikeService.update(productLikeDislike));
    } else {
      this.subscribeToSaveResponse(this.productLikeDislikeService.create(productLikeDislike));
    }
  }

  trackProductById(index: number, item: IProduct): number {
    return item.id!;
  }

  trackUserById(index: number, item: IUser): string {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProductLikeDislike>>): void {
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

  protected updateForm(productLikeDislike: IProductLikeDislike): void {
    this.editForm.patchValue({
      id: productLikeDislike.id,
      like: productLikeDislike.like,
      dislike: productLikeDislike.dislike,
      date: productLikeDislike.date ? productLikeDislike.date.format(DATE_TIME_FORMAT) : null,
      comment: productLikeDislike.comment,
      product: productLikeDislike.product,
      user: productLikeDislike.user,
    });

    this.productsSharedCollection = this.productService.addProductToCollectionIfMissing(
      this.productsSharedCollection,
      productLikeDislike.product
    );
    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, productLikeDislike.user);
  }

  protected loadRelationshipsOptions(): void {
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

  protected createFromForm(): IProductLikeDislike {
    return {
      ...new ProductLikeDislike(),
      id: this.editForm.get(['id'])!.value,
      like: this.editForm.get(['like'])!.value,
      dislike: this.editForm.get(['dislike'])!.value,
      date: this.editForm.get(['date'])!.value ? dayjs(this.editForm.get(['date'])!.value, DATE_TIME_FORMAT) : undefined,
      comment: this.editForm.get(['comment'])!.value,
      product: this.editForm.get(['product'])!.value,
      user: this.editForm.get(['user'])!.value,
    };
  }
}
