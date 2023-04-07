import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IOrganizationStarRating, OrganizationStarRating } from '../organization-star-rating.model';
import { OrganizationStarRatingService } from '../service/organization-star-rating.service';
import { IOrganization } from 'app/entities/organization/organization.model';
import { OrganizationService } from 'app/entities/organization/service/organization.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-organization-star-rating-update',
  templateUrl: './organization-star-rating-update.component.html',
})
export class OrganizationStarRatingUpdateComponent implements OnInit {
  isSaving = false;

  organizationsSharedCollection: IOrganization[] = [];
  usersSharedCollection: IUser[] = [];

  editForm = this.fb.group({
    id: [],
    stars: [],
    date: [],
    comment: [],
    organization: [],
    user: [],
  });

  constructor(
    protected organizationStarRatingService: OrganizationStarRatingService,
    protected organizationService: OrganizationService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    protected fb: UntypedFormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ organizationStarRating }) => {
      if (organizationStarRating.id === undefined) {
        const today = dayjs().startOf('day');
        organizationStarRating.date = today;
      }

      this.updateForm(organizationStarRating);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const organizationStarRating = this.createFromForm();
    if (organizationStarRating.id !== undefined) {
      this.subscribeToSaveResponse(this.organizationStarRatingService.update(organizationStarRating));
    } else {
      this.subscribeToSaveResponse(this.organizationStarRatingService.create(organizationStarRating));
    }
  }

  trackOrganizationById(index: number, item: IOrganization): number {
    return item.id!;
  }

  trackUserById(index: number, item: IUser): string {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOrganizationStarRating>>): void {
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

  protected updateForm(organizationStarRating: IOrganizationStarRating): void {
    this.editForm.patchValue({
      id: organizationStarRating.id,
      stars: organizationStarRating.stars,
      date: organizationStarRating.date ? organizationStarRating.date.format(DATE_TIME_FORMAT) : null,
      comment: organizationStarRating.comment,
      organization: organizationStarRating.organization,
      user: organizationStarRating.user,
    });

    this.organizationsSharedCollection = this.organizationService.addOrganizationToCollectionIfMissing(
      this.organizationsSharedCollection,
      organizationStarRating.organization
    );
    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, organizationStarRating.user);
  }

  protected loadRelationshipsOptions(): void {
    this.organizationService
      .query()
      .pipe(map((res: HttpResponse<IOrganization[]>) => res.body ?? []))
      .pipe(
        map((organizations: IOrganization[]) =>
          this.organizationService.addOrganizationToCollectionIfMissing(organizations, this.editForm.get('organization')!.value)
        )
      )
      .subscribe((organizations: IOrganization[]) => (this.organizationsSharedCollection = organizations));

    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('user')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }

  protected createFromForm(): IOrganizationStarRating {
    return {
      ...new OrganizationStarRating(),
      id: this.editForm.get(['id'])!.value,
      stars: this.editForm.get(['stars'])!.value,
      date: this.editForm.get(['date'])!.value ? dayjs(this.editForm.get(['date'])!.value, DATE_TIME_FORMAT) : undefined,
      comment: this.editForm.get(['comment'])!.value,
      organization: this.editForm.get(['organization'])!.value,
      user: this.editForm.get(['user'])!.value,
    };
  }
}
