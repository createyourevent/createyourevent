import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IOrganizationLikeDislike } from '../organization-like-dislike.model';

@Component({
  selector: 'jhi-organization-like-dislike-detail',
  templateUrl: './organization-like-dislike-detail.component.html',
})
export class OrganizationLikeDislikeDetailComponent implements OnInit {
  organizationLikeDislike: IOrganizationLikeDislike | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ organizationLikeDislike }) => {
      this.organizationLikeDislike = organizationLikeDislike;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
