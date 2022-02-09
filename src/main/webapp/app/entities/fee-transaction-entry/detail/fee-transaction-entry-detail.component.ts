import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFeeTransactionEntry } from '../fee-transaction-entry.model';

@Component({
  selector: 'jhi-fee-transaction-entry-detail',
  templateUrl: './fee-transaction-entry-detail.component.html',
})
export class FeeTransactionEntryDetailComponent implements OnInit {
  feeTransactionEntry: IFeeTransactionEntry | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ feeTransactionEntry }) => {
      this.feeTransactionEntry = feeTransactionEntry;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
