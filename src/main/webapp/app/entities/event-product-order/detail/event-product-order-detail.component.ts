import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEventProductOrder } from '../event-product-order.model';

@Component({
  selector: 'jhi-event-product-order-detail',
  templateUrl: './event-product-order-detail.component.html',
})
export class EventProductOrderDetailComponent implements OnInit {
  eventProductOrder: IEventProductOrder | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ eventProductOrder }) => {
      this.eventProductOrder = eventProductOrder;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
