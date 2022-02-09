import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IGiftShoppingCart, GiftShoppingCart } from '../gift-shopping-cart.model';
import { GiftShoppingCartService } from '../service/gift-shopping-cart.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IGift } from 'app/entities/gift/gift.model';
import { GiftService } from 'app/entities/gift/service/gift.service';

@Component({
  selector: 'jhi-gift-shopping-cart-update',
  templateUrl: './gift-shopping-cart-update.component.html',
})
export class GiftShoppingCartUpdateComponent implements OnInit {
  isSaving = false;

  usersSharedCollection: IUser[] = [];
  giftsSharedCollection: IGift[] = [];

  editForm = this.fb.group({
    id: [],
    date: [],
    amount: [],
    user: [],
    gift: [],
  });

  constructor(
    protected giftShoppingCartService: GiftShoppingCartService,
    protected userService: UserService,
    protected giftService: GiftService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ giftShoppingCart }) => {
      if (giftShoppingCart.id === undefined) {
        const today = dayjs().startOf('day');
        giftShoppingCart.date = today;
      }

      this.updateForm(giftShoppingCart);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const giftShoppingCart = this.createFromForm();
    if (giftShoppingCart.id !== undefined) {
      this.subscribeToSaveResponse(this.giftShoppingCartService.update(giftShoppingCart));
    } else {
      this.subscribeToSaveResponse(this.giftShoppingCartService.create(giftShoppingCart));
    }
  }

  trackUserById(index: number, item: IUser): string {
    return item.id!;
  }

  trackGiftById(index: number, item: IGift): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IGiftShoppingCart>>): void {
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

  protected updateForm(giftShoppingCart: IGiftShoppingCart): void {
    this.editForm.patchValue({
      id: giftShoppingCart.id,
      date: giftShoppingCart.date ? giftShoppingCart.date.format(DATE_TIME_FORMAT) : null,
      amount: giftShoppingCart.amount,
      user: giftShoppingCart.user,
      gift: giftShoppingCart.gift,
    });

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, giftShoppingCart.user);
    this.giftsSharedCollection = this.giftService.addGiftToCollectionIfMissing(this.giftsSharedCollection, giftShoppingCart.gift);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('user')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.giftService
      .query()
      .pipe(map((res: HttpResponse<IGift[]>) => res.body ?? []))
      .pipe(map((gifts: IGift[]) => this.giftService.addGiftToCollectionIfMissing(gifts, this.editForm.get('gift')!.value)))
      .subscribe((gifts: IGift[]) => (this.giftsSharedCollection = gifts));
  }

  protected createFromForm(): IGiftShoppingCart {
    return {
      ...new GiftShoppingCart(),
      id: this.editForm.get(['id'])!.value,
      date: this.editForm.get(['date'])!.value ? dayjs(this.editForm.get(['date'])!.value, DATE_TIME_FORMAT) : undefined,
      amount: this.editForm.get(['amount'])!.value,
      user: this.editForm.get(['user'])!.value,
      gift: this.editForm.get(['gift'])!.value,
    };
  }
}
