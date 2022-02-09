import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ProductStarRatingComponent } from '../list/product-star-rating.component';
import { ProductStarRatingDetailComponent } from '../detail/product-star-rating-detail.component';
import { ProductStarRatingUpdateComponent } from '../update/product-star-rating-update.component';
import { ProductStarRatingRoutingResolveService } from './product-star-rating-routing-resolve.service';

const productStarRatingRoute: Routes = [
  {
    path: '',
    component: ProductStarRatingComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ProductStarRatingDetailComponent,
    resolve: {
      productStarRating: ProductStarRatingRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ProductStarRatingUpdateComponent,
    resolve: {
      productStarRating: ProductStarRatingRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ProductStarRatingUpdateComponent,
    resolve: {
      productStarRating: ProductStarRatingRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(productStarRatingRoute)],
  exports: [RouterModule],
})
export class ProductStarRatingRoutingModule {}
