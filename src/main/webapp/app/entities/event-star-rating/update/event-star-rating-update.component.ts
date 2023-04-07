import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IEventStarRating, EventStarRating } from '../event-star-rating.model';
import { EventStarRatingService } from '../service/event-star-rating.service';
import { IEvent } from 'app/entities/event/event.model';
import { EventService } from 'app/entities/event/service/event.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-event-star-rating-update',
  templateUrl: './event-star-rating-update.component.html',
})
export class EventStarRatingUpdateComponent implements OnInit {
  isSaving = false;

  eventsSharedCollection: IEvent[] = [];
  usersSharedCollection: IUser[] = [];

  editForm = this.fb.group({
    id: [],
    stars: [],
    date: [],
    comment: [],
    event: [],
    user: [],
  });

  constructor(
    protected eventStarRatingService: EventStarRatingService,
    protected eventService: EventService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    protected fb: UntypedFormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ eventStarRating }) => {
      if (eventStarRating.id === undefined) {
        const today = dayjs().startOf('day');
        eventStarRating.date = today;
      }

      this.updateForm(eventStarRating);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const eventStarRating = this.createFromForm();
    if (eventStarRating.id !== undefined) {
      this.subscribeToSaveResponse(this.eventStarRatingService.update(eventStarRating));
    } else {
      this.subscribeToSaveResponse(this.eventStarRatingService.create(eventStarRating));
    }
  }

  trackEventById(index: number, item: IEvent): number {
    return item.id!;
  }

  trackUserById(index: number, item: IUser): string {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEventStarRating>>): void {
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

  protected updateForm(eventStarRating: IEventStarRating): void {
    this.editForm.patchValue({
      id: eventStarRating.id,
      stars: eventStarRating.stars,
      date: eventStarRating.date ? eventStarRating.date.format(DATE_TIME_FORMAT) : null,
      comment: eventStarRating.comment,
      event: eventStarRating.event,
      user: eventStarRating.user,
    });

    this.eventsSharedCollection = this.eventService.addEventToCollectionIfMissing(this.eventsSharedCollection, eventStarRating.event);
    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, eventStarRating.user);
  }

  protected loadRelationshipsOptions(): void {
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

  protected createFromForm(): IEventStarRating {
    return {
      ...new EventStarRating(),
      id: this.editForm.get(['id'])!.value,
      stars: this.editForm.get(['stars'])!.value,
      date: this.editForm.get(['date'])!.value ? dayjs(this.editForm.get(['date'])!.value, DATE_TIME_FORMAT) : undefined,
      comment: this.editForm.get(['comment'])!.value,
      event: this.editForm.get(['event'])!.value,
      user: this.editForm.get(['user'])!.value,
    };
  }
}
