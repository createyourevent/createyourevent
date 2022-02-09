import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFeeBalance } from '../fee-balance.model';

@Component({
  selector: 'jhi-fee-balance-detail',
  templateUrl: './fee-balance-detail.component.html',
})
export class FeeBalanceDetailComponent implements OnInit {
  feeBalance: IFeeBalance | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ feeBalance }) => {
      this.feeBalance = feeBalance;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
