import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IEventProductRating, EventProductRating } from '../event-product-rating.model';
import { EventProductRatingService } from '../service/event-product-rating.service';
import { IProduct } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/service/product.service';
import { IEvent } from 'app/entities/event/event.model';
import { EventService } from 'app/entities/event/service/event.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-event-product-rating-update',
  templateUrl: './event-product-rating-update.component.html',
})
export class EventProductRatingUpdateComponent implements OnInit {
  isSaving = false;

  productsSharedCollection: IProduct[] = [];
  eventsSharedCollection: IEvent[] = [];
  usersSharedCollection: IUser[] = [];

  editForm = this.fb.group({
    id: [],
    like: [],
    dislike: [],
    date: [],
    comment: [],
    product: [],
    event: [],
    user: [],
  });

  constructor(
    protected eventProductRatingService: EventProductRatingService,
    protected productService: ProductService,
    protected eventService: EventService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ eventProductRating }) => {
      if (eventProductRating.id === undefined) {
        const today = dayjs().startOf('day');
        eventProductRating.date = today;
      }

      this.updateForm(eventProductRating);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const eventProductRating = this.createFromForm();
    if (eventProductRating.id !== undefined) {
      this.subscribeToSaveResponse(this.eventProductRatingService.update(eventProductRating));
    } else {
      this.subscribeToSaveResponse(this.eventProductRatingService.create(eventProductRating));
    }
  }

  trackProductById(index: number, item: IProduct): number {
    return item.id!;
  }

  trackEventById(index: number, item: IEvent): number {
    return item.id!;
  }

  trackUserById(index: number, item: IUser): string {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEventProductRating>>): void {
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

  protected updateForm(eventProductRating: IEventProductRating): void {
    this.editForm.patchValue({
      id: eventProductRating.id,
      like: eventProductRating.like,
      dislike: eventProductRating.dislike,
      date: eventProductRating.date ? eventProductRating.date.format(DATE_TIME_FORMAT) : null,
      comment: eventProductRating.comment,
      product: eventProductRating.product,
      event: eventProductRating.event,
      user: eventProductRating.user,
    });

    this.productsSharedCollection = this.productService.addProductToCollectionIfMissing(
      this.productsSharedCollection,
      eventProductRating.product
    );
    this.eventsSharedCollection = this.eventService.addEventToCollectionIfMissing(this.eventsSharedCollection, eventProductRating.event);
    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, eventProductRating.user);
  }

  protected loadRelationshipsOptions(): void {
    this.productService
      .query()
      .pipe(map((res: HttpResponse<IProduct[]>) => res.body ?? []))
      .pipe(
        map((products: IProduct[]) => this.productService.addProductToCollectionIfMissing(products, this.editForm.get('product')!.value))
      )
      .subscribe((products: IProduct[]) => (this.productsSharedCollection = products));

    this.eventService
      .query()
      .pipe(map((res: HttpResponse<IEvent[]>) => res.body ?? []))
      .pipe(map((events: IEvent[]) => this.eventService.addEventToCollectionIfMissing(events, this.editForm.get('event')!.value)))
      .subscribe((events: IEvent[]) => (this.eventsSharedCollection = events));

    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('user')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }

  protected createFromForm(): IEventProductRating {
    return {
      ...new EventProductRating(),
      id: this.editForm.get(['id'])!.value,
      like: this.editForm.get(['like'])!.value,
      dislike: this.editForm.get(['dislike'])!.value,
      date: this.editForm.get(['date'])!.value ? dayjs(this.editForm.get(['date'])!.value, DATE_TIME_FORMAT) : undefined,
      comment: this.editForm.get(['comment'])!.value,
      product: this.editForm.get(['product'])!.value,
      event: this.editForm.get(['event'])!.value,
      user: this.editForm.get(['user'])!.value,
    };
  }
}
