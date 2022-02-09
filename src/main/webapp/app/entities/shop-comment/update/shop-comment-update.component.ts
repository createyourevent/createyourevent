import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IShopComment, ShopComment } from '../shop-comment.model';
import { ShopCommentService } from '../service/shop-comment.service';
import { IShop } from 'app/entities/shop/shop.model';
import { ShopService } from 'app/entities/shop/service/shop.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-shop-comment-update',
  templateUrl: './shop-comment-update.component.html',
})
export class ShopCommentUpdateComponent implements OnInit {
  isSaving = false;

  shopCommentsSharedCollection: IShopComment[] = [];
  shopsSharedCollection: IShop[] = [];
  usersSharedCollection: IUser[] = [];

  editForm = this.fb.group({
    id: [],
    comment: [],
    date: [],
    shop: [],
    user: [],
    shopComment: [],
  });

  constructor(
    protected shopCommentService: ShopCommentService,
    protected shopService: ShopService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ shopComment }) => {
      if (shopComment.id === undefined) {
        const today = dayjs().startOf('day');
        shopComment.date = today;
      }

      this.updateForm(shopComment);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const shopComment = this.createFromForm();
    if (shopComment.id !== undefined) {
      this.subscribeToSaveResponse(this.shopCommentService.update(shopComment));
    } else {
      this.subscribeToSaveResponse(this.shopCommentService.create(shopComment));
    }
  }

  trackShopCommentById(index: number, item: IShopComment): number {
    return item.id!;
  }

  trackShopById(index: number, item: IShop): number {
    return item.id!;
  }

  trackUserById(index: number, item: IUser): string {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IShopComment>>): void {
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

  protected updateForm(shopComment: IShopComment): void {
    this.editForm.patchValue({
      id: shopComment.id,
      comment: shopComment.comment,
      date: shopComment.date ? shopComment.date.format(DATE_TIME_FORMAT) : null,
      shop: shopComment.shop,
      user: shopComment.user,
      shopComment: shopComment.shopComment,
    });

    this.shopCommentsSharedCollection = this.shopCommentService.addShopCommentToCollectionIfMissing(
      this.shopCommentsSharedCollection,
      shopComment.shopComment
    );
    this.shopsSharedCollection = this.shopService.addShopToCollectionIfMissing(this.shopsSharedCollection, shopComment.shop);
    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, shopComment.user);
  }

  protected loadRelationshipsOptions(): void {
    this.shopCommentService
      .query()
      .pipe(map((res: HttpResponse<IShopComment[]>) => res.body ?? []))
      .pipe(
        map((shopComments: IShopComment[]) =>
          this.shopCommentService.addShopCommentToCollectionIfMissing(shopComments, this.editForm.get('shopComment')!.value)
        )
      )
      .subscribe((shopComments: IShopComment[]) => (this.shopCommentsSharedCollection = shopComments));

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

  protected createFromForm(): IShopComment {
    return {
      ...new ShopComment(),
      id: this.editForm.get(['id'])!.value,
      comment: this.editForm.get(['comment'])!.value,
      date: this.editForm.get(['date'])!.value ? dayjs(this.editForm.get(['date'])!.value, DATE_TIME_FORMAT) : undefined,
      shop: this.editForm.get(['shop'])!.value,
      user: this.editForm.get(['user'])!.value,
      shopComment: this.editForm.get(['shopComment'])!.value,
    };
  }
}
