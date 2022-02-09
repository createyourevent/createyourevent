import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IServiceComment, ServiceComment } from '../service-comment.model';
import { ServiceCommentService } from '../service/service-comment.service';
import { ICreateYourEventService } from 'app/entities/create-your-event-service/create-your-event-service.model';
import { CreateYourEventServiceService } from 'app/entities/create-your-event-service/service/create-your-event-service.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-service-comment-update',
  templateUrl: './service-comment-update.component.html',
})
export class ServiceCommentUpdateComponent implements OnInit {
  isSaving = false;

  serviceCommentsSharedCollection: IServiceComment[] = [];
  createYourEventServicesSharedCollection: ICreateYourEventService[] = [];
  usersSharedCollection: IUser[] = [];

  editForm = this.fb.group({
    id: [],
    comment: [],
    date: [],
    createYourEventService: [],
    user: [],
    serviceComment: [],
  });

  constructor(
    protected serviceCommentService: ServiceCommentService,
    protected createYourEventServiceService: CreateYourEventServiceService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ serviceComment }) => {
      if (serviceComment.id === undefined) {
        const today = dayjs().startOf('day');
        serviceComment.date = today;
      }

      this.updateForm(serviceComment);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const serviceComment = this.createFromForm();
    if (serviceComment.id !== undefined) {
      this.subscribeToSaveResponse(this.serviceCommentService.update(serviceComment));
    } else {
      this.subscribeToSaveResponse(this.serviceCommentService.create(serviceComment));
    }
  }

  trackServiceCommentById(index: number, item: IServiceComment): number {
    return item.id!;
  }

  trackCreateYourEventServiceById(index: number, item: ICreateYourEventService): number {
    return item.id!;
  }

  trackUserById(index: number, item: IUser): string {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IServiceComment>>): void {
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

  protected updateForm(serviceComment: IServiceComment): void {
    this.editForm.patchValue({
      id: serviceComment.id,
      comment: serviceComment.comment,
      date: serviceComment.date ? serviceComment.date.format(DATE_TIME_FORMAT) : null,
      createYourEventService: serviceComment.createYourEventService,
      user: serviceComment.user,
      serviceComment: serviceComment.serviceComment,
    });

    this.serviceCommentsSharedCollection = this.serviceCommentService.addServiceCommentToCollectionIfMissing(
      this.serviceCommentsSharedCollection,
      serviceComment.serviceComment
    );
    this.createYourEventServicesSharedCollection = this.createYourEventServiceService.addCreateYourEventServiceToCollectionIfMissing(
      this.createYourEventServicesSharedCollection,
      serviceComment.createYourEventService
    );
    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, serviceComment.user);
  }

  protected loadRelationshipsOptions(): void {
    this.serviceCommentService
      .query()
      .pipe(map((res: HttpResponse<IServiceComment[]>) => res.body ?? []))
      .pipe(
        map((serviceComments: IServiceComment[]) =>
          this.serviceCommentService.addServiceCommentToCollectionIfMissing(serviceComments, this.editForm.get('serviceComment')!.value)
        )
      )
      .subscribe((serviceComments: IServiceComment[]) => (this.serviceCommentsSharedCollection = serviceComments));

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

  protected createFromForm(): IServiceComment {
    return {
      ...new ServiceComment(),
      id: this.editForm.get(['id'])!.value,
      comment: this.editForm.get(['comment'])!.value,
      date: this.editForm.get(['date'])!.value ? dayjs(this.editForm.get(['date'])!.value, DATE_TIME_FORMAT) : undefined,
      createYourEventService: this.editForm.get(['createYourEventService'])!.value,
      user: this.editForm.get(['user'])!.value,
      serviceComment: this.editForm.get(['serviceComment'])!.value,
    };
  }
}
