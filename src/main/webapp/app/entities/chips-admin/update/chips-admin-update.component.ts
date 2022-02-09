import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IChipsAdmin, ChipsAdmin } from '../chips-admin.model';
import { ChipsAdminService } from '../service/chips-admin.service';

@Component({
  selector: 'jhi-chips-admin-update',
  templateUrl: './chips-admin-update.component.html',
})
export class ChipsAdminUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    gameActive: [],
  });

  constructor(protected chipsAdminService: ChipsAdminService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ chipsAdmin }) => {
      this.updateForm(chipsAdmin);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const chipsAdmin = this.createFromForm();
    if (chipsAdmin.id !== undefined) {
      this.subscribeToSaveResponse(this.chipsAdminService.update(chipsAdmin));
    } else {
      this.subscribeToSaveResponse(this.chipsAdminService.create(chipsAdmin));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IChipsAdmin>>): void {
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

  protected updateForm(chipsAdmin: IChipsAdmin): void {
    this.editForm.patchValue({
      id: chipsAdmin.id,
      gameActive: chipsAdmin.gameActive,
    });
  }

  protected createFromForm(): IChipsAdmin {
    return {
      ...new ChipsAdmin(),
      id: this.editForm.get(['id'])!.value,
      gameActive: this.editForm.get(['gameActive'])!.value,
    };
  }
}
