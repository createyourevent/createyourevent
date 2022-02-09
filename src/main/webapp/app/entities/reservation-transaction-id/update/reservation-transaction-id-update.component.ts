import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IReservationTransactionId, ReservationTransactionId } from '../reservation-transaction-id.model';
import { ReservationTransactionIdService } from '../service/reservation-transaction-id.service';

@Component({
  selector: 'jhi-reservation-transaction-id-update',
  templateUrl: './reservation-transaction-id-update.component.html',
})
export class ReservationTransactionIdUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    transactionDepositId: [],
    transactionId: [],
  });

  constructor(
    protected reservationTransactionIdService: ReservationTransactionIdService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ reservationTransactionId }) => {
      this.updateForm(reservationTransactionId);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const reservationTransactionId = this.createFromForm();
    if (reservationTransactionId.id !== undefined) {
      this.subscribeToSaveResponse(this.reservationTransactionIdService.update(reservationTransactionId));
    } else {
      this.subscribeToSaveResponse(this.reservationTransactionIdService.create(reservationTransactionId));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IReservationTransactionId>>): void {
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

  protected updateForm(reservationTransactionId: IReservationTransactionId): void {
    this.editForm.patchValue({
      id: reservationTransactionId.id,
      transactionDepositId: reservationTransactionId.transactionDepositId,
      transactionId: reservationTransactionId.transactionId,
    });
  }

  protected createFromForm(): IReservationTransactionId {
    return {
      ...new ReservationTransactionId(),
      id: this.editForm.get(['id'])!.value,
      transactionDepositId: this.editForm.get(['transactionDepositId'])!.value,
      transactionId: this.editForm.get(['transactionId'])!.value,
    };
  }
}
