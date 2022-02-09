import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ServiceLikeDislikeComponent } from '../list/service-like-dislike.component';
import { ServiceLikeDislikeDetailComponent } from '../detail/service-like-dislike-detail.component';
import { ServiceLikeDislikeUpdateComponent } from '../update/service-like-dislike-update.component';
import { ServiceLikeDislikeRoutingResolveService } from './service-like-dislike-routing-resolve.service';

const serviceLikeDislikeRoute: Routes = [
  {
    path: '',
    component: ServiceLikeDislikeComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ServiceLikeDislikeDetailComponent,
    resolve: {
      serviceLikeDislike: ServiceLikeDislikeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ServiceLikeDislikeUpdateComponent,
    resolve: {
      serviceLikeDislike: ServiceLikeDislikeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ServiceLikeDislikeUpdateComponent,
    resolve: {
      serviceLikeDislike: ServiceLikeDislikeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(serviceLikeDislikeRoute)],
  exports: [RouterModule],
})
export class ServiceLikeDislikeRoutingModule {}
