import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IServiceStarRating, ServiceStarRating } from '../service-star-rating.model';
import { ServiceStarRatingService } from '../service/service-star-rating.service';
import { ICreateYourEventService } from 'app/entities/create-your-event-service/create-your-event-service.model';
import { CreateYourEventServiceService } from 'app/entities/create-your-event-service/service/create-your-event-service.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-service-star-rating-update',
  templateUrl: './service-star-rating-update.component.html',
})
export class ServiceStarRatingUpdateComponent implements OnInit {
  isSaving = false;

  createYourEventServicesSharedCollection: ICreateYourEventService[] = [];
  usersSharedCollection: IUser[] = [];

  editForm = this.fb.group({
    id: [],
    stars: [],
    date: [],
    comment: [],
    service: [],
    user: [],
  });

  constructor(
    protected serviceStarRatingService: ServiceStarRatingService,
    protected createYourEventServiceService: CreateYourEventServiceService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ serviceStarRating }) => {
      if (serviceStarRating.id === undefined) {
        const today = dayjs().startOf('day');
        serviceStarRating.date = today;
      }

      this.updateForm(serviceStarRating);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const serviceStarRating = this.createFromForm();
    if (serviceStarRating.id !== undefined) {
      this.subscribeToSaveResponse(this.serviceStarRatingService.update(serviceStarRating));
    } else {
      this.subscribeToSaveResponse(this.serviceStarRatingService.create(serviceStarRating));
    }
  }

  trackCreateYourEventServiceById(index: number, item: ICreateYourEventService): number {
    return item.id!;
  }

  trackUserById(index: number, item: IUser): string {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IServiceStarRating>>): void {
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

  protected updateForm(serviceStarRating: IServiceStarRating): void {
    this.editForm.patchValue({
      id: serviceStarRating.id,
      stars: serviceStarRating.stars,
      date: serviceStarRating.date ? serviceStarRating.date.format(DATE_TIME_FORMAT) : null,
      comment: serviceStarRating.comment,
      service: serviceStarRating.service,
      user: serviceStarRating.user,
    });

    this.createYourEventServicesSharedCollection = this.createYourEventServiceService.addCreateYourEventServiceToCollectionIfMissing(
      this.createYourEventServicesSharedCollection,
      serviceStarRating.service
    );
    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, serviceStarRating.user);
  }

  protected loadRelationshipsOptions(): void {
    this.createYourEventServiceService
      .query()
      .pipe(map((res: HttpResponse<ICreateYourEventService[]>) => res.body ?? []))
      .pipe(
        map((createYourEventServices: ICreateYourEventService[]) =>
          this.createYourEventServiceService.addCreateYourEventServiceToCollectionIfMissing(
            createYourEventServices,
            this.editForm.get('service')!.value
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

  protected createFromForm(): IServiceStarRating {
    return {
      ...new ServiceStarRating(),
      id: this.editForm.get(['id'])!.value,
      stars: this.editForm.get(['stars'])!.value,
      date: this.editForm.get(['date'])!.value ? dayjs(this.editForm.get(['date'])!.value, DATE_TIME_FORMAT) : undefined,
      comment: this.editForm.get(['comment'])!.value,
      service: this.editForm.get(['service'])!.value,
      user: this.editForm.get(['user'])!.value,
    };
  }
}
