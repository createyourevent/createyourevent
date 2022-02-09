import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IChipsCollection } from '../chips-collection.model';

@Component({
  selector: 'jhi-chips-collection-detail',
  templateUrl: './chips-collection-detail.component.html',
})
export class ChipsCollectionDetailComponent implements OnInit {
  chipsCollection: IChipsCollection | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ chipsCollection }) => {
      this.chipsCollection = chipsCollection;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
