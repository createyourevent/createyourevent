import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IChipsCollectionChips } from '../chips-collection-chips.model';

@Component({
  selector: 'jhi-chips-collection-chips-detail',
  templateUrl: './chips-collection-chips-detail.component.html',
})
export class ChipsCollectionChipsDetailComponent implements OnInit {
  chipsCollectionChips: IChipsCollectionChips | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ chipsCollectionChips }) => {
      this.chipsCollectionChips = chipsCollectionChips;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
