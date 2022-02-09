import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ShopLikeDislikeComponent } from '../list/shop-like-dislike.component';
import { ShopLikeDislikeDetailComponent } from '../detail/shop-like-dislike-detail.component';
import { ShopLikeDislikeUpdateComponent } from '../update/shop-like-dislike-update.component';
import { ShopLikeDislikeRoutingResolveService } from './shop-like-dislike-routing-resolve.service';

const shopLikeDislikeRoute: Routes = [
  {
    path: '',
    component: ShopLikeDislikeComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ShopLikeDislikeDetailComponent,
    resolve: {
      shopLikeDislike: ShopLikeDislikeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ShopLikeDislikeUpdateComponent,
    resolve: {
      shopLikeDislike: ShopLikeDislikeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ShopLikeDislikeUpdateComponent,
    resolve: {
      shopLikeDislike: ShopLikeDislikeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(shopLikeDislikeRoute)],
  exports: [RouterModule],
})
export class ShopLikeDislikeRoutingModule {}
