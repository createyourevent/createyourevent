import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IShopStarRating, ShopStarRating } from '../shop-star-rating.model';
import { ShopStarRatingService } from '../service/shop-star-rating.service';
import { IShop } from 'app/entities/shop/shop.model';
import { ShopService } from 'app/entities/shop/service/shop.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-shop-star-rating-update',
  templateUrl: './shop-star-rating-update.component.html',
})
export class ShopStarRatingUpdateComponent implements OnInit {
  isSaving = false;

  shopsSharedCollection: IShop[] = [];
  usersSharedCollection: IUser[] = [];

  editForm = this.fb.group({
    id: [],
    stars: [],
    date: [],
    comment: [],
    shop: [],
    user: [],
  });

  constructor(
    protected shopStarRatingService: ShopStarRatingService,
    protected shopService: ShopService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ shopStarRating }) => {
      if (shopStarRating.id === undefined) {
        const today = dayjs().startOf('day');
        shopStarRating.date = today;
      }

      this.updateForm(shopStarRating);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const shopStarRating = this.createFromForm();
    if (shopStarRating.id !== undefined) {
      this.subscribeToSaveResponse(this.shopStarRatingService.update(shopStarRating));
    } else {
      this.subscribeToSaveResponse(this.shopStarRatingService.create(shopStarRating));
    }
  }

  trackShopById(index: number, item: IShop): number {
    return item.id!;
  }

  trackUserById(index: number, item: IUser): string {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IShopStarRating>>): void {
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

  protected updateForm(shopStarRating: IShopStarRating): void {
    this.editForm.patchValue({
      id: shopStarRating.id,
      stars: shopStarRating.stars,
      date: shopStarRating.date ? shopStarRating.date.format(DATE_TIME_FORMAT) : null,
      comment: shopStarRating.comment,
      shop: shopStarRating.shop,
      user: shopStarRating.user,
    });

    this.shopsSharedCollection = this.shopService.addShopToCollectionIfMissing(this.shopsSharedCollection, shopStarRating.shop);
    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, shopStarRating.user);
  }

  protected loadRelationshipsOptions(): void {
    this.shopService
      .query()
      .pipe(map((res: HttpResponse<IShop[]>) => res.body ?? []))
      .pipe(map((shops: IShop[]) => this.shopService.addShopToCollectionIfMissing(shops, this.editForm.get('shop')!.value)))
      .subscribe((shops: IShop[]) => (this.shopsSharedCollection = shops));

    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('user')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }

  protected createFromForm(): IShopStarRating {
    return {
      ...new ShopStarRating(),
      id: this.editForm.get(['id'])!.value,
      stars: this.editForm.get(['stars'])!.value,
      date: this.editForm.get(['date'])!.value ? dayjs(this.editForm.get(['date'])!.value, DATE_TIME_FORMAT) : undefined,
      comment: this.editForm.get(['comment'])!.value,
      shop: this.editForm.get(['shop'])!.value,
      user: this.editForm.get(['user'])!.value,
    };
  }
}
