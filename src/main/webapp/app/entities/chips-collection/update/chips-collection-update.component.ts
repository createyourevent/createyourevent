import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IChipsCollection, ChipsCollection } from '../chips-collection.model';
import { ChipsCollectionService } from '../service/chips-collection.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-chips-collection-update',
  templateUrl: './chips-collection-update.component.html',
})
export class ChipsCollectionUpdateComponent implements OnInit {
  isSaving = false;

  usersSharedCollection: IUser[] = [];

  editForm = this.fb.group({
    id: [],
    user: [],
  });

  constructor(
    protected chipsCollectionService: ChipsCollectionService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ chipsCollection }) => {
      this.updateForm(chipsCollection);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const chipsCollection = this.createFromForm();
    if (chipsCollection.id !== undefined) {
      this.subscribeToSaveResponse(this.chipsCollectionService.update(chipsCollection));
    } else {
      this.subscribeToSaveResponse(this.chipsCollectionService.create(chipsCollection));
    }
  }

  trackUserById(index: number, item: IUser): string {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IChipsCollection>>): void {
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

  protected updateForm(chipsCollection: IChipsCollection): void {
    this.editForm.patchValue({
      id: chipsCollection.id,
      user: chipsCollection.user,
    });

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, chipsCollection.user);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('user')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }

  protected createFromForm(): IChipsCollection {
    return {
      ...new ChipsCollection(),
      id: this.editForm.get(['id'])!.value,
      user: this.editForm.get(['user'])!.value,
    };
  }
}
