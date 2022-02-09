import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFeeTransactionId } from '../fee-transaction-id.model';

@Component({
  selector: 'jhi-fee-transaction-id-detail',
  templateUrl: './fee-transaction-id-detail.component.html',
})
export class FeeTransactionIdDetailComponent implements OnInit {
  feeTransactionId: IFeeTransactionId | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ feeTransactionId }) => {
      this.feeTransactionId = feeTransactionId;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
