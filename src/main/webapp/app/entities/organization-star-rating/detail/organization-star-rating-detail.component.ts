import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IOrganizationStarRating } from '../organization-star-rating.model';

@Component({
  selector: 'jhi-organization-star-rating-detail',
  templateUrl: './organization-star-rating-detail.component.html',
})
export class OrganizationStarRatingDetailComponent implements OnInit {
  organizationStarRating: IOrganizationStarRating | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ organizationStarRating }) => {
      this.organizationStarRating = organizationStarRating;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
