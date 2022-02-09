import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IReservationTransactionId } from '../reservation-transaction-id.model';

@Component({
  selector: 'jhi-reservation-transaction-id-detail',
  templateUrl: './reservation-transaction-id-detail.component.html',
})
export class ReservationTransactionIdDetailComponent implements OnInit {
  reservationTransactionId: IReservationTransactionId | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ reservationTransactionId }) => {
      this.reservationTransactionId = reservationTransactionId;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
