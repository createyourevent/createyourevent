import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IRideCosts, RideCosts } from '../ride-costs.model';
import { RideCostsService } from '../service/ride-costs.service';

@Component({
  selector: 'jhi-ride-costs-update',
  templateUrl: './ride-costs-update.component.html',
})
export class RideCostsUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    pricePerKilometre: [null, [Validators.required]],
  });

  constructor(protected rideCostsService: RideCostsService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ rideCosts }) => {
      this.updateForm(rideCosts);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const rideCosts = this.createFromForm();
    if (rideCosts.id !== undefined) {
      this.subscribeToSaveResponse(this.rideCostsService.update(rideCosts));
    } else {
      this.subscribeToSaveResponse(this.rideCostsService.create(rideCosts));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRideCosts>>): void {
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

  protected updateForm(rideCosts: IRideCosts): void {
    this.editForm.patchValue({
      id: rideCosts.id,
      pricePerKilometre: rideCosts.pricePerKilometre,
    });
  }

  protected createFromForm(): IRideCosts {
    return {
      ...new RideCosts(),
      id: this.editForm.get(['id'])!.value,
      pricePerKilometre: this.editForm.get(['pricePerKilometre'])!.value,
    };
  }
}
