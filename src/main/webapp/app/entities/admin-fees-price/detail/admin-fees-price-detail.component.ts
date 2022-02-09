import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAdminFeesPrice } from '../admin-fees-price.model';

@Component({
  selector: 'jhi-admin-fees-price-detail',
  templateUrl: './admin-fees-price-detail.component.html',
})
export class AdminFeesPriceDetailComponent implements OnInit {
  adminFeesPrice: IAdminFeesPrice | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ adminFeesPrice }) => {
      this.adminFeesPrice = adminFeesPrice;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
