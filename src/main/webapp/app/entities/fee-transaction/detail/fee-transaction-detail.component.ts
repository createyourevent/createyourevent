import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFeeTransaction } from '../fee-transaction.model';

@Component({
  selector: 'jhi-fee-transaction-detail',
  templateUrl: './fee-transaction-detail.component.html',
})
export class FeeTransactionDetailComponent implements OnInit {
  feeTransaction: IFeeTransaction | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ feeTransaction }) => {
      this.feeTransaction = feeTransaction;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
