import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISlotListOrange } from '../slot-list-orange.model';

@Component({
  selector: 'jhi-slot-list-orange-detail',
  templateUrl: './slot-list-orange-detail.component.html',
})
export class SlotListOrangeDetailComponent implements OnInit {
  slotListOrange: ISlotListOrange | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ slotListOrange }) => {
      this.slotListOrange = slotListOrange;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
