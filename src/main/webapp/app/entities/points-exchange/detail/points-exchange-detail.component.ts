import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPointsExchange } from '../points-exchange.model';

@Component({
  selector: 'jhi-points-exchange-detail',
  templateUrl: './points-exchange-detail.component.html',
})
export class PointsExchangeDetailComponent implements OnInit {
  pointsExchange: IPointsExchange | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ pointsExchange }) => {
      this.pointsExchange = pointsExchange;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
