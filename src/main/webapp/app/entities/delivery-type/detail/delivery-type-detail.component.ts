import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDeliveryType } from '../delivery-type.model';

@Component({
  selector: 'jhi-delivery-type-detail',
  templateUrl: './delivery-type-detail.component.html',
})
export class DeliveryTypeDetailComponent implements OnInit {
  deliveryType: IDeliveryType | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ deliveryType }) => {
      this.deliveryType = deliveryType;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
