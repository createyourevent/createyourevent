import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IPointsExchange, PointsExchange } from '../points-exchange.model';
import { PointsExchangeService } from '../service/points-exchange.service';

@Component({
  selector: 'jhi-points-exchange-update',
  templateUrl: './points-exchange-update.component.html',
})
export class PointsExchangeUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    pointsTotal: [],
    bondPointsTotal: [],
  });

  constructor(
    protected pointsExchangeService: PointsExchangeService,
    protected activatedRoute: ActivatedRoute,
    protected fb: UntypedFormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ pointsExchange }) => {
      this.updateForm(pointsExchange);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const pointsExchange = this.createFromForm();
    if (pointsExchange.id !== undefined) {
      this.subscribeToSaveResponse(this.pointsExchangeService.update(pointsExchange));
    } else {
      this.subscribeToSaveResponse(this.pointsExchangeService.create(pointsExchange));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPointsExchange>>): void {
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

  protected updateForm(pointsExchange: IPointsExchange): void {
    this.editForm.patchValue({
      id: pointsExchange.id,
      pointsTotal: pointsExchange.pointsTotal,
      bondPointsTotal: pointsExchange.bondPointsTotal,
    });
  }

  protected createFromForm(): IPointsExchange {
    return {
      ...new PointsExchange(),
      id: this.editForm.get(['id'])!.value,
      pointsTotal: this.editForm.get(['pointsTotal'])!.value,
      bondPointsTotal: this.editForm.get(['bondPointsTotal'])!.value,
    };
  }
}
