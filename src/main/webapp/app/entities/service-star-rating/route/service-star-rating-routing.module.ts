import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ServiceStarRatingComponent } from '../list/service-star-rating.component';
import { ServiceStarRatingDetailComponent } from '../detail/service-star-rating-detail.component';
import { ServiceStarRatingUpdateComponent } from '../update/service-star-rating-update.component';
import { ServiceStarRatingRoutingResolveService } from './service-star-rating-routing-resolve.service';

const serviceStarRatingRoute: Routes = [
  {
    path: '',
    component: ServiceStarRatingComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ServiceStarRatingDetailComponent,
    resolve: {
      serviceStarRating: ServiceStarRatingRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ServiceStarRatingUpdateComponent,
    resolve: {
      serviceStarRating: ServiceStarRatingRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ServiceStarRatingUpdateComponent,
    resolve: {
      serviceStarRating: ServiceStarRatingRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(serviceStarRatingRoute)],
  exports: [RouterModule],
})
export class ServiceStarRatingRoutingModule {}
