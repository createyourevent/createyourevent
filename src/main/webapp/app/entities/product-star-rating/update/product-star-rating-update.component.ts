import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IProductStarRating, ProductStarRating } from '../product-star-rating.model';
import { ProductStarRatingService } from '../service/product-star-rating.service';
import { IProduct } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/service/product.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-product-star-rating-update',
  templateUrl: './product-star-rating-update.component.html',
})
export class ProductStarRatingUpdateComponent implements OnInit {
  isSaving = false;

  productsSharedCollection: IProduct[] = [];
  usersSharedCollection: IUser[] = [];

  editForm = this.fb.group({
    id: [],
    stars: [],
    date: [],
    comment: [],
    product: [],
    user: [],
  });

  constructor(
    protected productStarRatingService: ProductStarRatingService,
    protected productService: ProductService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    protected fb: UntypedFormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ productStarRating }) => {
      if (productStarRating.id === undefined) {
        const today = dayjs().startOf('day');
        productStarRating.date = today;
      }

      this.updateForm(productStarRating);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const productStarRating = this.createFromForm();
    if (productStarRating.id !== undefined) {
      this.subscribeToSaveResponse(this.productStarRatingService.update(productStarRating));
    } else {
      this.subscribeToSaveResponse(this.productStarRatingService.create(productStarRating));
    }
  }

  trackProductById(index: number, item: IProduct): number {
    return item.id!;
  }

  trackUserById(index: number, item: IUser): string {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProductStarRating>>): void {
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

  protected updateForm(productStarRating: IProductStarRating): void {
    this.editForm.patchValue({
      id: productStarRating.id,
      stars: productStarRating.stars,
      date: productStarRating.date ? productStarRating.date.format(DATE_TIME_FORMAT) : null,
      comment: productStarRating.comment,
      product: productStarRating.product,
      user: productStarRating.user,
    });

    this.productsSharedCollection = this.productService.addProductToCollectionIfMissing(
      this.productsSharedCollection,
      productStarRating.product
    );
    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, productStarRating.user);
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

  protected createFromForm(): IProductStarRating {
    return {
      ...new ProductStarRating(),
      id: this.editForm.get(['id'])!.value,
      stars: this.editForm.get(['stars'])!.value,
      date: this.editForm.get(['date'])!.value ? dayjs(this.editForm.get(['date'])!.value, DATE_TIME_FORMAT) : undefined,
      comment: this.editForm.get(['comment'])!.value,
      product: this.editForm.get(['product'])!.value,
      user: this.editForm.get(['user'])!.value,
    };
  }
}
