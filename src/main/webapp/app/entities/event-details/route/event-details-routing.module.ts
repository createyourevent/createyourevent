import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { EventDetailsComponent } from '../list/event-details.component';
import { EventDetailsDetailComponent } from '../detail/event-details-detail.component';
import { EventDetailsUpdateComponent } from '../update/event-details-update.component';
import { EventDetailsRoutingResolveService } from './event-details-routing-resolve.service';

const eventDetailsRoute: Routes = [
  {
    path: '',
    component: EventDetailsComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EventDetailsDetailComponent,
    resolve: {
      eventDetails: EventDetailsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EventDetailsUpdateComponent,
    resolve: {
      eventDetails: EventDetailsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EventDetailsUpdateComponent,
    resolve: {
      eventDetails: EventDetailsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(eventDetailsRoute)],
  exports: [RouterModule],
})
export class EventDetailsRoutingModule {}
