import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IEventProductRatingComment, EventProductRatingComment } from '../event-product-rating-comment.model';
import { EventProductRatingCommentService } from '../service/event-product-rating-comment.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IEvent } from 'app/entities/event/event.model';
import { EventService } from 'app/entities/event/service/event.service';
import { IProduct } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/service/product.service';

@Component({
  selector: 'jhi-event-product-rating-comment-update',
  templateUrl: './event-product-rating-comment-update.component.html',
})
export class EventProductRatingCommentUpdateComponent implements OnInit {
  isSaving = false;

  usersSharedCollection: IUser[] = [];
  eventsSharedCollection: IEvent[] = [];
  productsSharedCollection: IProduct[] = [];

  editForm = this.fb.group({
    id: [],
    comment: [],
    date: [],
    user: [],
    event: [],
    product: [],
  });

  constructor(
    protected eventProductRatingCommentService: EventProductRatingCommentService,
    protected userService: UserService,
    protected eventService: EventService,
    protected productService: ProductService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ eventProductRatingComment }) => {
      if (eventProductRatingComment.id === undefined) {
        const today = dayjs().startOf('day');
        eventProductRatingComment.date = today;
      }

      this.updateForm(eventProductRatingComment);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const eventProductRatingComment = this.createFromForm();
    if (eventProductRatingComment.id !== undefined) {
      this.subscribeToSaveResponse(this.eventProductRatingCommentService.update(eventProductRatingComment));
    } else {
      this.subscribeToSaveResponse(this.eventProductRatingCommentService.create(eventProductRatingComment));
    }
  }

  trackUserById(index: number, item: IUser): string {
    return item.id!;
  }

  trackEventById(index: number, item: IEvent): number {
    return item.id!;
  }

  trackProductById(index: number, item: IProduct): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEventProductRatingComment>>): void {
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

  protected updateForm(eventProductRatingComment: IEventProductRatingComment): void {
    this.editForm.patchValue({
      id: eventProductRatingComment.id,
      comment: eventProductRatingComment.comment,
      date: eventProductRatingComment.date ? eventProductRatingComment.date.format(DATE_TIME_FORMAT) : null,
      user: eventProductRatingComment.user,
      event: eventProductRatingComment.event,
      product: eventProductRatingComment.product,
    });

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, eventProductRatingComment.user);
    this.eventsSharedCollection = this.eventService.addEventToCollectionIfMissing(
      this.eventsSharedCollection,
      eventProductRatingComment.event
    );
    this.productsSharedCollection = this.productService.addProductToCollectionIfMissing(
      this.productsSharedCollection,
      eventProductRatingComment.product
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('user')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.eventService
      .query()
      .pipe(map((res: HttpResponse<IEvent[]>) => res.body ?? []))
      .pipe(map((events: IEvent[]) => this.eventService.addEventToCollectionIfMissing(events, this.editForm.get('event')!.value)))
      .subscribe((events: IEvent[]) => (this.eventsSharedCollection = events));

    this.productService
      .query()
      .pipe(map((res: HttpResponse<IProduct[]>) => res.body ?? []))
      .pipe(
        map((products: IProduct[]) => this.productService.addProductToCollectionIfMissing(products, this.editForm.get('product')!.value))
      )
      .subscribe((products: IProduct[]) => (this.productsSharedCollection = products));
  }

  protected createFromForm(): IEventProductRatingComment {
    return {
      ...new EventProductRatingComment(),
      id: this.editForm.get(['id'])!.value,
      comment: this.editForm.get(['comment'])!.value,
      date: this.editForm.get(['date'])!.value ? dayjs(this.editForm.get(['date'])!.value, DATE_TIME_FORMAT) : undefined,
      user: this.editForm.get(['user'])!.value,
      event: this.editForm.get(['event'])!.value,
      product: this.editForm.get(['product'])!.value,
    };
  }
}
