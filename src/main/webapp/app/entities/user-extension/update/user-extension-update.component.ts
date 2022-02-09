import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IUserExtension, UserExtension } from '../user-extension.model';
import { UserExtensionService } from '../service/user-extension.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-user-extension-update',
  templateUrl: './user-extension-update.component.html',
})
export class UserExtensionUpdateComponent implements OnInit {
  isSaving = false;

  usersSharedCollection: IUser[] = [];

  editForm = this.fb.group({
    id: [],
    address: [],
    phone: [],
    loggedIn: [],
    points: [],
    user: [],
  });

  constructor(
    protected userExtensionService: UserExtensionService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userExtension }) => {
      this.updateForm(userExtension);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const userExtension = this.createFromForm();
    if (userExtension.id !== undefined) {
      this.subscribeToSaveResponse(this.userExtensionService.update(userExtension));
    } else {
      this.subscribeToSaveResponse(this.userExtensionService.create(userExtension));
    }
  }

  trackUserById(index: number, item: IUser): string {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUserExtension>>): void {
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

  protected updateForm(userExtension: IUserExtension): void {
    this.editForm.patchValue({
      id: userExtension.id,
      address: userExtension.address,
      phone: userExtension.phone,
      loggedIn: userExtension.loggedIn,
      points: userExtension.points,
      user: userExtension.user,
    });

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, userExtension.user);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('user')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }

  protected createFromForm(): IUserExtension {
    return {
      ...new UserExtension(),
      id: this.editForm.get(['id'])!.value,
      address: this.editForm.get(['address'])!.value,
      phone: this.editForm.get(['phone'])!.value,
      loggedIn: this.editForm.get(['loggedIn'])!.value,
      points: this.editForm.get(['points'])!.value,
      user: this.editForm.get(['user'])!.value,
    };
  }
}
