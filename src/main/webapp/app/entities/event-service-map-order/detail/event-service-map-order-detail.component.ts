import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEventServiceMapOrder } from '../event-service-map-order.model';

@Component({
  selector: 'jhi-event-service-map-order-detail',
  templateUrl: './event-service-map-order-detail.component.html',
})
export class EventServiceMapOrderDetailComponent implements OnInit {
  eventServiceMapOrder: IEventServiceMapOrder | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ eventServiceMapOrder }) => {
      this.eventServiceMapOrder = eventServiceMapOrder;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
