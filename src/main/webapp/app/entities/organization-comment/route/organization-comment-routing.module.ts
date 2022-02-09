import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { OrganizationCommentComponent } from '../list/organization-comment.component';
import { OrganizationCommentDetailComponent } from '../detail/organization-comment-detail.component';
import { OrganizationCommentUpdateComponent } from '../update/organization-comment-update.component';
import { OrganizationCommentRoutingResolveService } from './organization-comment-routing-resolve.service';

const organizationCommentRoute: Routes = [
  {
    path: '',
    component: OrganizationCommentComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: OrganizationCommentDetailComponent,
    resolve: {
      organizationComment: OrganizationCommentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: OrganizationCommentUpdateComponent,
    resolve: {
      organizationComment: OrganizationCommentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: OrganizationCommentUpdateComponent,
    resolve: {
      organizationComment: OrganizationCommentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(organizationCommentRoute)],
  exports: [RouterModule],
})
export class OrganizationCommentRoutingModule {}
