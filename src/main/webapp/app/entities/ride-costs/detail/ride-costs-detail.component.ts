import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IRideCosts } from '../ride-costs.model';

@Component({
  selector: 'jhi-ride-costs-detail',
  templateUrl: './ride-costs-detail.component.html',
})
export class RideCostsDetailComponent implements OnInit {
  rideCosts: IRideCosts | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ rideCosts }) => {
      this.rideCosts = rideCosts;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
