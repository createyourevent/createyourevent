import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ShopStarRatingComponent } from '../list/shop-star-rating.component';
import { ShopStarRatingDetailComponent } from '../detail/shop-star-rating-detail.component';
import { ShopStarRatingUpdateComponent } from '../update/shop-star-rating-update.component';
import { ShopStarRatingRoutingResolveService } from './shop-star-rating-routing-resolve.service';

const shopStarRatingRoute: Routes = [
  {
    path: '',
    component: ShopStarRatingComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ShopStarRatingDetailComponent,
    resolve: {
      shopStarRating: ShopStarRatingRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ShopStarRatingUpdateComponent,
    resolve: {
      shopStarRating: ShopStarRatingRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ShopStarRatingUpdateComponent,
    resolve: {
      shopStarRating: ShopStarRatingRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(shopStarRatingRoute)],
  exports: [RouterModule],
})
export class ShopStarRatingRoutingModule {}
