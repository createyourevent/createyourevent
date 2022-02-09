import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IFeeTransactionId, FeeTransactionId } from '../fee-transaction-id.model';
import { FeeTransactionIdService } from '../service/fee-transaction-id.service';

@Component({
  selector: 'jhi-fee-transaction-id-update',
  templateUrl: './fee-transaction-id-update.component.html',
})
export class FeeTransactionIdUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    transactionId: [],
  });

  constructor(
    protected feeTransactionIdService: FeeTransactionIdService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ feeTransactionId }) => {
      this.updateForm(feeTransactionId);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const feeTransactionId = this.createFromForm();
    if (feeTransactionId.id !== undefined) {
      this.subscribeToSaveResponse(this.feeTransactionIdService.update(feeTransactionId));
    } else {
      this.subscribeToSaveResponse(this.feeTransactionIdService.create(feeTransactionId));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFeeTransactionId>>): void {
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

  protected updateForm(feeTransactionId: IFeeTransactionId): void {
    this.editForm.patchValue({
      id: feeTransactionId.id,
      transactionId: feeTransactionId.transactionId,
    });
  }

  protected createFromForm(): IFeeTransactionId {
    return {
      ...new FeeTransactionId(),
      id: this.editForm.get(['id'])!.value,
      transactionId: this.editForm.get(['transactionId'])!.value,
    };
  }
}
