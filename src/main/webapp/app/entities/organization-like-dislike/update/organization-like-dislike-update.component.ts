import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IOrganizationLikeDislike, OrganizationLikeDislike } from '../organization-like-dislike.model';
import { OrganizationLikeDislikeService } from '../service/organization-like-dislike.service';
import { IOrganization } from 'app/entities/organization/organization.model';
import { OrganizationService } from 'app/entities/organization/service/organization.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-organization-like-dislike-update',
  templateUrl: './organization-like-dislike-update.component.html',
})
export class OrganizationLikeDislikeUpdateComponent implements OnInit {
  isSaving = false;

  organizationsSharedCollection: IOrganization[] = [];
  usersSharedCollection: IUser[] = [];

  editForm = this.fb.group({
    id: [],
    like: [],
    dislike: [],
    date: [],
    comment: [],
    organization: [],
    event: [],
    user: [],
  });

  constructor(
    protected organizationLikeDislikeService: OrganizationLikeDislikeService,
    protected organizationService: OrganizationService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ organizationLikeDislike }) => {
      if (organizationLikeDislike.id === undefined) {
        const today = dayjs().startOf('day');
        organizationLikeDislike.date = today;
      }

      this.updateForm(organizationLikeDislike);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const organizationLikeDislike = this.createFromForm();
    if (organizationLikeDislike.id !== undefined) {
      this.subscribeToSaveResponse(this.organizationLikeDislikeService.update(organizationLikeDislike));
    } else {
      this.subscribeToSaveResponse(this.organizationLikeDislikeService.create(organizationLikeDislike));
    }
  }

  trackOrganizationById(index: number, item: IOrganization): number {
    return item.id!;
  }

  trackUserById(index: number, item: IUser): string {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOrganizationLikeDislike>>): void {
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

  protected updateForm(organizationLikeDislike: IOrganizationLikeDislike): void {
    this.editForm.patchValue({
      id: organizationLikeDislike.id,
      like: organizationLikeDislike.like,
      dislike: organizationLikeDislike.dislike,
      date: organizationLikeDislike.date ? organizationLikeDislike.date.format(DATE_TIME_FORMAT) : null,
      comment: organizationLikeDislike.comment,
      organization: organizationLikeDislike.organization,
      event: organizationLikeDislike.event,
      user: organizationLikeDislike.user,
    });

    this.organizationsSharedCollection = this.organizationService.addOrganizationToCollectionIfMissing(
      this.organizationsSharedCollection,
      organizationLikeDislike.organization,
      organizationLikeDislike.event
    );
    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, organizationLikeDislike.user);
  }

  protected loadRelationshipsOptions(): void {
    this.organizationService
      .query()
      .pipe(map((res: HttpResponse<IOrganization[]>) => res.body ?? []))
      .pipe(
        map((organizations: IOrganization[]) =>
          this.organizationService.addOrganizationToCollectionIfMissing(
            organizations,
            this.editForm.get('organization')!.value,
            this.editForm.get('event')!.value
          )
        )
      )
      .subscribe((organizations: IOrganization[]) => (this.organizationsSharedCollection = organizations));

    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('user')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }

  protected createFromForm(): IOrganizationLikeDislike {
    return {
      ...new OrganizationLikeDislike(),
      id: this.editForm.get(['id'])!.value,
      like: this.editForm.get(['like'])!.value,
      dislike: this.editForm.get(['dislike'])!.value,
      date: this.editForm.get(['date'])!.value ? dayjs(this.editForm.get(['date'])!.value, DATE_TIME_FORMAT) : undefined,
      comment: this.editForm.get(['comment'])!.value,
      organization: this.editForm.get(['organization'])!.value,
      event: this.editForm.get(['event'])!.value,
      user: this.editForm.get(['user'])!.value,
    };
  }
}
