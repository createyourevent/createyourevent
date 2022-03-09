import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISlotListPlum } from '../slot-list-plum.model';

@Component({
  selector: 'jhi-slot-list-plum-detail',
  templateUrl: './slot-list-plum-detail.component.html',
})
export class SlotListPlumDetailComponent implements OnInit {
  slotListPlum: ISlotListPlum | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ slotListPlum }) => {
      this.slotListPlum = slotListPlum;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
