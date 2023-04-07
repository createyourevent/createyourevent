import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IServiceLikeDislike, ServiceLikeDislike } from '../service-like-dislike.model';
import { ServiceLikeDislikeService } from '../service/service-like-dislike.service';
import { ICreateYourEventService } from 'app/entities/create-your-event-service/create-your-event-service.model';
import { CreateYourEventServiceService } from 'app/entities/create-your-event-service/service/create-your-event-service.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-service-like-dislike-update',
  templateUrl: './service-like-dislike-update.component.html',
})
export class ServiceLikeDislikeUpdateComponent implements OnInit {
  isSaving = false;

  createYourEventServicesSharedCollection: ICreateYourEventService[] = [];
  usersSharedCollection: IUser[] = [];

  editForm = this.fb.group({
    id: [],
    like: [],
    dislike: [],
    date: [],
    comment: [],
    createYourEventService: [],
    user: [],
  });

  constructor(
    protected serviceLikeDislikeService: ServiceLikeDislikeService,
    protected createYourEventServiceService: CreateYourEventServiceService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    protected fb: UntypedFormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ serviceLikeDislike }) => {
      if (serviceLikeDislike.id === undefined) {
        const today = dayjs().startOf('day');
        serviceLikeDislike.date = today;
      }

      this.updateForm(serviceLikeDislike);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const serviceLikeDislike = this.createFromForm();
    if (serviceLikeDislike.id !== undefined) {
      this.subscribeToSaveResponse(this.serviceLikeDislikeService.update(serviceLikeDislike));
    } else {
      this.subscribeToSaveResponse(this.serviceLikeDislikeService.create(serviceLikeDislike));
    }
  }

  trackCreateYourEventServiceById(index: number, item: ICreateYourEventService): number {
    return item.id!;
  }

  trackUserById(index: number, item: IUser): string {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IServiceLikeDislike>>): void {
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

  protected updateForm(serviceLikeDislike: IServiceLikeDislike): void {
    this.editForm.patchValue({
      id: serviceLikeDislike.id,
      like: serviceLikeDislike.like,
      dislike: serviceLikeDislike.dislike,
      date: serviceLikeDislike.date ? serviceLikeDislike.date.format(DATE_TIME_FORMAT) : null,
      comment: serviceLikeDislike.comment,
      createYourEventService: serviceLikeDislike.createYourEventService,
      user: serviceLikeDislike.user,
    });

    this.createYourEventServicesSharedCollection = this.createYourEventServiceService.addCreateYourEventServiceToCollectionIfMissing(
      this.createYourEventServicesSharedCollection,
      serviceLikeDislike.createYourEventService
    );
    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, serviceLikeDislike.user);
  }

  protected loadRelationshipsOptions(): void {
    this.createYourEventServiceService
      .query()
      .pipe(map((res: HttpResponse<ICreateYourEventService[]>) => res.body ?? []))
      .pipe(
        map((createYourEventServices: ICreateYourEventService[]) =>
          this.createYourEventServiceService.addCreateYourEventServiceToCollectionIfMissing(
            createYourEventServices,
            this.editForm.get('createYourEventService')!.value
          )
        )
      )
      .subscribe(
        (createYourEventServices: ICreateYourEventService[]) => (this.createYourEventServicesSharedCollection = createYourEventServices)
      );

    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('user')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }

  protected createFromForm(): IServiceLikeDislike {
    return {
      ...new ServiceLikeDislike(),
      id: this.editForm.get(['id'])!.value,
      like: this.editForm.get(['like'])!.value,
      dislike: this.editForm.get(['dislike'])!.value,
      date: this.editForm.get(['date'])!.value ? dayjs(this.editForm.get(['date'])!.value, DATE_TIME_FORMAT) : undefined,
      comment: this.editForm.get(['comment'])!.value,
      createYourEventService: this.editForm.get(['createYourEventService'])!.value,
      user: this.editForm.get(['user'])!.value,
    };
  }
}
