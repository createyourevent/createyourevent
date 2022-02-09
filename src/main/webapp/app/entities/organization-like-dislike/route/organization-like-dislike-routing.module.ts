import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { OrganizationLikeDislikeComponent } from '../list/organization-like-dislike.component';
import { OrganizationLikeDislikeDetailComponent } from '../detail/organization-like-dislike-detail.component';
import { OrganizationLikeDislikeUpdateComponent } from '../update/organization-like-dislike-update.component';
import { OrganizationLikeDislikeRoutingResolveService } from './organization-like-dislike-routing-resolve.service';

const organizationLikeDislikeRoute: Routes = [
  {
    path: '',
    component: OrganizationLikeDislikeComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: OrganizationLikeDislikeDetailComponent,
    resolve: {
      organizationLikeDislike: OrganizationLikeDislikeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: OrganizationLikeDislikeUpdateComponent,
    resolve: {
      organizationLikeDislike: OrganizationLikeDislikeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: OrganizationLikeDislikeUpdateComponent,
    resolve: {
      organizationLikeDislike: OrganizationLikeDislikeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(organizationLikeDislikeRoute)],
  exports: [RouterModule],
})
export class OrganizationLikeDislikeRoutingModule {}
