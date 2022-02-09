import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ProductLikeDislikeComponent } from '../list/product-like-dislike.component';
import { ProductLikeDislikeDetailComponent } from '../detail/product-like-dislike-detail.component';
import { ProductLikeDislikeUpdateComponent } from '../update/product-like-dislike-update.component';
import { ProductLikeDislikeRoutingResolveService } from './product-like-dislike-routing-resolve.service';

const productLikeDislikeRoute: Routes = [
  {
    path: '',
    component: ProductLikeDislikeComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ProductLikeDislikeDetailComponent,
    resolve: {
      productLikeDislike: ProductLikeDislikeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ProductLikeDislikeUpdateComponent,
    resolve: {
      productLikeDislike: ProductLikeDislikeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ProductLikeDislikeUpdateComponent,
    resolve: {
      productLikeDislike: ProductLikeDislikeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(productLikeDislikeRoute)],
  exports: [RouterModule],
})
export class ProductLikeDislikeRoutingModule {}
