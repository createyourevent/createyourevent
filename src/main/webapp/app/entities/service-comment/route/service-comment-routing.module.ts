import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ServiceCommentComponent } from '../list/service-comment.component';
import { ServiceCommentDetailComponent } from '../detail/service-comment-detail.component';
import { ServiceCommentUpdateComponent } from '../update/service-comment-update.component';
import { ServiceCommentRoutingResolveService } from './service-comment-routing-resolve.service';

const serviceCommentRoute: Routes = [
  {
    path: '',
    component: ServiceCommentComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ServiceCommentDetailComponent,
    resolve: {
      serviceComment: ServiceCommentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ServiceCommentUpdateComponent,
    resolve: {
      serviceComment: ServiceCommentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ServiceCommentUpdateComponent,
    resolve: {
      serviceComment: ServiceCommentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(serviceCommentRoute)],
  exports: [RouterModule],
})
export class ServiceCommentRoutingModule {}
