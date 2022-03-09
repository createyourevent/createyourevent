import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISlotListCherry } from '../slot-list-cherry.model';

@Component({
  selector: 'jhi-slot-list-cherry-detail',
  templateUrl: './slot-list-cherry-detail.component.html',
})
export class SlotListCherryDetailComponent implements OnInit {
  slotListCherry: ISlotListCherry | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ slotListCherry }) => {
      this.slotListCherry = slotListCherry;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
