import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IOrganizationComment, OrganizationComment } from '../organization-comment.model';
import { OrganizationCommentService } from '../service/organization-comment.service';
import { IOrganization } from 'app/entities/organization/organization.model';
import { OrganizationService } from 'app/entities/organization/service/organization.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-organization-comment-update',
  templateUrl: './organization-comment-update.component.html',
})
export class OrganizationCommentUpdateComponent implements OnInit {
  isSaving = false;

  organizationCommentsSharedCollection: IOrganizationComment[] = [];
  organizationsSharedCollection: IOrganization[] = [];
  usersSharedCollection: IUser[] = [];

  editForm = this.fb.group({
    id: [],
    comment: [],
    date: [],
    organization: [],
    user: [],
    event: [],
    organizationComment: [],
  });

  constructor(
    protected organizationCommentService: OrganizationCommentService,
    protected organizationService: OrganizationService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ organizationComment }) => {
      if (organizationComment.id === undefined) {
        const today = dayjs().startOf('day');
        organizationComment.date = today;
      }

      this.updateForm(organizationComment);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const organizationComment = this.createFromForm();
    if (organizationComment.id !== undefined) {
      this.subscribeToSaveResponse(this.organizationCommentService.update(organizationComment));
    } else {
      this.subscribeToSaveResponse(this.organizationCommentService.create(organizationComment));
    }
  }

  trackOrganizationCommentById(index: number, item: IOrganizationComment): number {
    return item.id!;
  }

  trackOrganizationById(index: number, item: IOrganization): number {
    return item.id!;
  }

  trackUserById(index: number, item: IUser): string {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOrganizationComment>>): void {
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

  protected updateForm(organizationComment: IOrganizationComment): void {
    this.editForm.patchValue({
      id: organizationComment.id,
      comment: organizationComment.comment,
      date: organizationComment.date ? organizationComment.date.format(DATE_TIME_FORMAT) : null,
      organization: organizationComment.organization,
      user: organizationComment.user,
      event: organizationComment.event,
      organizationComment: organizationComment.organizationComment,
    });

    this.organizationCommentsSharedCollection = this.organizationCommentService.addOrganizationCommentToCollectionIfMissing(
      this.organizationCommentsSharedCollection,
      organizationComment.organizationComment
    );
    this.organizationsSharedCollection = this.organizationService.addOrganizationToCollectionIfMissing(
      this.organizationsSharedCollection,
      organizationComment.organization,
      organizationComment.event
    );
    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, organizationComment.user);
  }

  protected loadRelationshipsOptions(): void {
    this.organizationCommentService
      .query()
      .pipe(map((res: HttpResponse<IOrganizationComment[]>) => res.body ?? []))
      .pipe(
        map((organizationComments: IOrganizationComment[]) =>
          this.organizationCommentService.addOrganizationCommentToCollectionIfMissing(
            organizationComments,
            this.editForm.get('organizationComment')!.value
          )
        )
      )
      .subscribe((organizationComments: IOrganizationComment[]) => (this.organizationCommentsSharedCollection = organizationComments));

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

  protected createFromForm(): IOrganizationComment {
    return {
      ...new OrganizationComment(),
      id: this.editForm.get(['id'])!.value,
      comment: this.editForm.get(['comment'])!.value,
      date: this.editForm.get(['date'])!.value ? dayjs(this.editForm.get(['date'])!.value, DATE_TIME_FORMAT) : undefined,
      organization: this.editForm.get(['organization'])!.value,
      user: this.editForm.get(['user'])!.value,
      event: this.editForm.get(['event'])!.value,
      organizationComment: this.editForm.get(['organizationComment'])!.value,
    };
  }
}
