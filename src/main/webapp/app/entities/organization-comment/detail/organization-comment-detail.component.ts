import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IOrganizationComment } from '../organization-comment.model';

@Component({
  selector: 'jhi-organization-comment-detail',
  templateUrl: './organization-comment-detail.component.html',
})
export class OrganizationCommentDetailComponent implements OnInit {
  organizationComment: IOrganizationComment | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ organizationComment }) => {
      this.organizationComment = organizationComment;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
