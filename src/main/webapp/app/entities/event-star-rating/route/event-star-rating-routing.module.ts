import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { EventStarRatingComponent } from '../list/event-star-rating.component';
import { EventStarRatingDetailComponent } from '../detail/event-star-rating-detail.component';
import { EventStarRatingUpdateComponent } from '../update/event-star-rating-update.component';
import { EventStarRatingRoutingResolveService } from './event-star-rating-routing-resolve.service';

const eventStarRatingRoute: Routes = [
  {
    path: '',
    component: EventStarRatingComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EventStarRatingDetailComponent,
    resolve: {
      eventStarRating: EventStarRatingRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EventStarRatingUpdateComponent,
    resolve: {
      eventStarRating: EventStarRatingRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EventStarRatingUpdateComponent,
    resolve: {
      eventStarRating: EventStarRatingRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(eventStarRatingRoute)],
  exports: [RouterModule],
})
export class EventStarRatingRoutingModule {}
