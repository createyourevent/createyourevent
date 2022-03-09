import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISlotListClock } from '../slot-list-clock.model';

@Component({
  selector: 'jhi-slot-list-clock-detail',
  templateUrl: './slot-list-clock-detail.component.html',
})
export class SlotListClockDetailComponent implements OnInit {
  slotListClock: ISlotListClock | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ slotListClock }) => {
      this.slotListClock = slotListClock;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
