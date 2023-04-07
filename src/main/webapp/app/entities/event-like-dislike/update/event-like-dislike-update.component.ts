import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IEventLikeDislike, EventLikeDislike } from '../event-like-dislike.model';
import { EventLikeDislikeService } from '../service/event-like-dislike.service';
import { IEvent } from 'app/entities/event/event.model';
import { EventService } from 'app/entities/event/service/event.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-event-like-dislike-update',
  templateUrl: './event-like-dislike-update.component.html',
})
export class EventLikeDislikeUpdateComponent implements OnInit {
  isSaving = false;

  eventsSharedCollection: IEvent[] = [];
  usersSharedCollection: IUser[] = [];

  editForm = this.fb.group({
    id: [],
    like: [],
    dislike: [],
    date: [],
    comment: [],
    event: [],
    user: [],
  });

  constructor(
    protected eventLikeDislikeService: EventLikeDislikeService,
    protected eventService: EventService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    protected fb: UntypedFormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ eventLikeDislike }) => {
      if (eventLikeDislike.id === undefined) {
        const today = dayjs().startOf('day');
        eventLikeDislike.date = today;
      }

      this.updateForm(eventLikeDislike);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const eventLikeDislike = this.createFromForm();
    if (eventLikeDislike.id !== undefined) {
      this.subscribeToSaveResponse(this.eventLikeDislikeService.update(eventLikeDislike));
    } else {
      this.subscribeToSaveResponse(this.eventLikeDislikeService.create(eventLikeDislike));
    }
  }

  trackEventById(index: number, item: IEvent): number {
    return item.id!;
  }

  trackUserById(index: number, item: IUser): string {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEventLikeDislike>>): void {
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

  protected updateForm(eventLikeDislike: IEventLikeDislike): void {
    this.editForm.patchValue({
      id: eventLikeDislike.id,
      like: eventLikeDislike.like,
      dislike: eventLikeDislike.dislike,
      date: eventLikeDislike.date ? eventLikeDislike.date.format(DATE_TIME_FORMAT) : null,
      comment: eventLikeDislike.comment,
      event: eventLikeDislike.event,
      user: eventLikeDislike.user,
    });

    this.eventsSharedCollection = this.eventService.addEventToCollectionIfMissing(this.eventsSharedCollection, eventLikeDislike.event);
    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, eventLikeDislike.user);
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

  protected createFromForm(): IEventLikeDislike {
    return {
      ...new EventLikeDislike(),
      id: this.editForm.get(['id'])!.value,
      like: this.editForm.get(['like'])!.value,
      dislike: this.editForm.get(['dislike'])!.value,
      date: this.editForm.get(['date'])!.value ? dayjs(this.editForm.get(['date'])!.value, DATE_TIME_FORMAT) : undefined,
      comment: this.editForm.get(['comment'])!.value,
      event: this.editForm.get(['event'])!.value,
      user: this.editForm.get(['user'])!.value,
    };
  }
}
