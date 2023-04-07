import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IShopLikeDislike, ShopLikeDislike } from '../shop-like-dislike.model';
import { ShopLikeDislikeService } from '../service/shop-like-dislike.service';
import { IShop } from 'app/entities/shop/shop.model';
import { ShopService } from 'app/entities/shop/service/shop.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-shop-like-dislike-update',
  templateUrl: './shop-like-dislike-update.component.html',
})
export class ShopLikeDislikeUpdateComponent implements OnInit {
  isSaving = false;

  shopsSharedCollection: IShop[] = [];
  usersSharedCollection: IUser[] = [];

  editForm = this.fb.group({
    id: [],
    like: [],
    dislike: [],
    date: [],
    comment: [],
    shop: [],
    user: [],
  });

  constructor(
    protected shopLikeDislikeService: ShopLikeDislikeService,
    protected shopService: ShopService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    protected fb: UntypedFormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ shopLikeDislike }) => {
      if (shopLikeDislike.id === undefined) {
        const today = dayjs().startOf('day');
        shopLikeDislike.date = today;
      }

      this.updateForm(shopLikeDislike);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const shopLikeDislike = this.createFromForm();
    if (shopLikeDislike.id !== undefined) {
      this.subscribeToSaveResponse(this.shopLikeDislikeService.update(shopLikeDislike));
    } else {
      this.subscribeToSaveResponse(this.shopLikeDislikeService.create(shopLikeDislike));
    }
  }

  trackShopById(index: number, item: IShop): number {
    return item.id!;
  }

  trackUserById(index: number, item: IUser): string {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IShopLikeDislike>>): void {
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

  protected updateForm(shopLikeDislike: IShopLikeDislike): void {
    this.editForm.patchValue({
      id: shopLikeDislike.id,
      like: shopLikeDislike.like,
      dislike: shopLikeDislike.dislike,
      date: shopLikeDislike.date ? shopLikeDislike.date.format(DATE_TIME_FORMAT) : null,
      comment: shopLikeDislike.comment,
      shop: shopLikeDislike.shop,
      user: shopLikeDislike.user,
    });

    this.shopsSharedCollection = this.shopService.addShopToCollectionIfMissing(this.shopsSharedCollection, shopLikeDislike.shop);
    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, shopLikeDislike.user);
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

  protected createFromForm(): IShopLikeDislike {
    return {
      ...new ShopLikeDislike(),
      id: this.editForm.get(['id'])!.value,
      like: this.editForm.get(['like'])!.value,
      dislike: this.editForm.get(['dislike'])!.value,
      date: this.editForm.get(['date'])!.value ? dayjs(this.editForm.get(['date'])!.value, DATE_TIME_FORMAT) : undefined,
      comment: this.editForm.get(['comment'])!.value,
      shop: this.editForm.get(['shop'])!.value,
      user: this.editForm.get(['user'])!.value,
    };
  }
}
