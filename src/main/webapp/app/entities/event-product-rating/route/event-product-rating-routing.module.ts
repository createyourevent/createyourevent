import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { EventProductRatingComponent } from '../list/event-product-rating.component';
import { EventProductRatingDetailComponent } from '../detail/event-product-rating-detail.component';
import { EventProductRatingUpdateComponent } from '../update/event-product-rating-update.component';
import { EventProductRatingRoutingResolveService } from './event-product-rating-routing-resolve.service';

const eventProductRatingRoute: Routes = [
  {
    path: '',
    component: EventProductRatingComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EventProductRatingDetailComponent,
    resolve: {
      eventProductRating: EventProductRatingRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EventProductRatingUpdateComponent,
    resolve: {
      eventProductRating: EventProductRatingRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EventProductRatingUpdateComponent,
    resolve: {
      eventProductRating: EventProductRatingRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(eventProductRatingRoute)],
  exports: [RouterModule],
})
export class EventProductRatingRoutingModule {}
