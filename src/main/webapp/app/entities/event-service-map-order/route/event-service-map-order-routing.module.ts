import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { EventServiceMapOrderComponent } from '../list/event-service-map-order.component';
import { EventServiceMapOrderDetailComponent } from '../detail/event-service-map-order-detail.component';
import { EventServiceMapOrderUpdateComponent } from '../update/event-service-map-order-update.component';
import { EventServiceMapOrderRoutingResolveService } from './event-service-map-order-routing-resolve.service';

const eventServiceMapOrderRoute: Routes = [
  {
    path: '',
    component: EventServiceMapOrderComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EventServiceMapOrderDetailComponent,
    resolve: {
      eventServiceMapOrder: EventServiceMapOrderRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EventServiceMapOrderUpdateComponent,
    resolve: {
      eventServiceMapOrder: EventServiceMapOrderRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EventServiceMapOrderUpdateComponent,
    resolve: {
      eventServiceMapOrder: EventServiceMapOrderRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(eventServiceMapOrderRoute)],
  exports: [RouterModule],
})
export class EventServiceMapOrderRoutingModule {}
