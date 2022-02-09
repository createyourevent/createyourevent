import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ShopCommentComponent } from '../list/shop-comment.component';
import { ShopCommentDetailComponent } from '../detail/shop-comment-detail.component';
import { ShopCommentUpdateComponent } from '../update/shop-comment-update.component';
import { ShopCommentRoutingResolveService } from './shop-comment-routing-resolve.service';

const shopCommentRoute: Routes = [
  {
    path: '',
    component: ShopCommentComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ShopCommentDetailComponent,
    resolve: {
      shopComment: ShopCommentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ShopCommentUpdateComponent,
    resolve: {
      shopComment: ShopCommentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ShopCommentUpdateComponent,
    resolve: {
      shopComment: ShopCommentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(shopCommentRoute)],
  exports: [RouterModule],
})
export class ShopCommentRoutingModule {}
