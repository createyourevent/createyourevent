import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IEventComment, EventComment } from '../event-comment.model';
import { EventCommentService } from '../service/event-comment.service';
import { IEvent } from 'app/entities/event/event.model';
import { EventService } from 'app/entities/event/service/event.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-event-comment-update',
  templateUrl: './event-comment-update.component.html',
})
export class EventCommentUpdateComponent implements OnInit {
  isSaving = false;

  eventCommentsSharedCollection: IEventComment[] = [];
  eventsSharedCollection: IEvent[] = [];
  usersSharedCollection: IUser[] = [];

  editForm = this.fb.group({
    id: [],
    comment: [],
    date: [],
    event: [],
    user: [],
    eventComment: [],
  });

  constructor(
    protected eventCommentService: EventCommentService,
    protected eventService: EventService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    protected fb: UntypedFormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ eventComment }) => {
      if (eventComment.id === undefined) {
        const today = dayjs().startOf('day');
        eventComment.date = today;
      }

      this.updateForm(eventComment);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const eventComment = this.createFromForm();
    if (eventComment.id !== undefined) {
      this.subscribeToSaveResponse(this.eventCommentService.update(eventComment));
    } else {
      this.subscribeToSaveResponse(this.eventCommentService.create(eventComment));
    }
  }

  trackEventCommentById(index: number, item: IEventComment): number {
    return item.id!;
  }

  trackEventById(index: number, item: IEvent): number {
    return item.id!;
  }

  trackUserById(index: number, item: IUser): string {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEventComment>>): void {
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

  protected updateForm(eventComment: IEventComment): void {
    this.editForm.patchValue({
      id: eventComment.id,
      comment: eventComment.comment,
      date: eventComment.date ? eventComment.date.format(DATE_TIME_FORMAT) : null,
      event: eventComment.event,
      user: eventComment.user,
      eventComment: eventComment.eventComment,
    });

    this.eventCommentsSharedCollection = this.eventCommentService.addEventCommentToCollectionIfMissing(
      this.eventCommentsSharedCollection,
      eventComment.eventComment
    );
    this.eventsSharedCollection = this.eventService.addEventToCollectionIfMissing(this.eventsSharedCollection, eventComment.event);
    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, eventComment.user);
  }

  protected loadRelationshipsOptions(): void {
    this.eventCommentService
      .query()
      .pipe(map((res: HttpResponse<IEventComment[]>) => res.body ?? []))
      .pipe(
        map((eventComments: IEventComment[]) =>
          this.eventCommentService.addEventCommentToCollectionIfMissing(eventComments, this.editForm.get('eventComment')!.value)
        )
      )
      .subscribe((eventComments: IEventComment[]) => (this.eventCommentsSharedCollection = eventComments));

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

  protected createFromForm(): IEventComment {
    return {
      ...new EventComment(),
      id: this.editForm.get(['id'])!.value,
      comment: this.editForm.get(['comment'])!.value,
      date: this.editForm.get(['date'])!.value ? dayjs(this.editForm.get(['date'])!.value, DATE_TIME_FORMAT) : undefined,
      event: this.editForm.get(['event'])!.value,
      user: this.editForm.get(['user'])!.value,
      eventComment: this.editForm.get(['eventComment'])!.value,
    };
  }
}
