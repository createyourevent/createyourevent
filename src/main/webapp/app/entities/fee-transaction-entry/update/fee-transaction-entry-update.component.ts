import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IFeeTransactionEntry, FeeTransactionEntry } from '../fee-transaction-entry.model';
import { FeeTransactionEntryService } from '../service/fee-transaction-entry.service';
import { IFeeTransaction } from 'app/entities/fee-transaction/fee-transaction.model';
import { FeeTransactionService } from 'app/entities/fee-transaction/service/fee-transaction.service';
import { FeeType } from 'app/entities/enumerations/fee-type.model';

@Component({
  selector: 'jhi-fee-transaction-entry-update',
  templateUrl: './fee-transaction-entry-update.component.html',
})
export class FeeTransactionEntryUpdateComponent implements OnInit {
  isSaving = false;
  feeTypeValues = Object.keys(FeeType);

  feeTransactionsSharedCollection: IFeeTransaction[] = [];

  editForm = this.fb.group({
    id: [],
    type: [],
    value: [],
    feeTransaction: [],
  });

  constructor(
    protected feeTransactionEntryService: FeeTransactionEntryService,
    protected feeTransactionService: FeeTransactionService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ feeTransactionEntry }) => {
      this.updateForm(feeTransactionEntry);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const feeTransactionEntry = this.createFromForm();
    if (feeTransactionEntry.id !== undefined) {
      this.subscribeToSaveResponse(this.feeTransactionEntryService.update(feeTransactionEntry));
    } else {
      this.subscribeToSaveResponse(this.feeTransactionEntryService.create(feeTransactionEntry));
    }
  }

  trackFeeTransactionById(index: number, item: IFeeTransaction): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFeeTransactionEntry>>): void {
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

  protected updateForm(feeTransactionEntry: IFeeTransactionEntry): void {
    this.editForm.patchValue({
      id: feeTransactionEntry.id,
      type: feeTransactionEntry.type,
      value: feeTransactionEntry.value,
      feeTransaction: feeTransactionEntry.feeTransaction,
    });

    this.feeTransactionsSharedCollection = this.feeTransactionService.addFeeTransactionToCollectionIfMissing(
      this.feeTransactionsSharedCollection,
      feeTransactionEntry.feeTransaction
    );
  }

  protected loadRelationshipsOptions(): void {
    this.feeTransactionService
      .query()
      .pipe(map((res: HttpResponse<IFeeTransaction[]>) => res.body ?? []))
      .pipe(
        map((feeTransactions: IFeeTransaction[]) =>
          this.feeTransactionService.addFeeTransactionToCollectionIfMissing(feeTransactions, this.editForm.get('feeTransaction')!.value)
        )
      )
      .subscribe((feeTransactions: IFeeTransaction[]) => (this.feeTransactionsSharedCollection = feeTransactions));
  }

  protected createFromForm(): IFeeTransactionEntry {
    return {
      ...new FeeTransactionEntry(),
      id: this.editForm.get(['id'])!.value,
      type: this.editForm.get(['type'])!.value,
      value: this.editForm.get(['value'])!.value,
      feeTransaction: this.editForm.get(['feeTransaction'])!.value,
    };
  }
}
