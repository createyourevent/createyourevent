import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { EventProductOrderComponent } from '../list/event-product-order.component';
import { EventProductOrderDetailComponent } from '../detail/event-product-order-detail.component';
import { EventProductOrderUpdateComponent } from '../update/event-product-order-update.component';
import { EventProductOrderRoutingResolveService } from './event-product-order-routing-resolve.service';

const eventProductOrderRoute: Routes = [
  {
    path: '',
    component: EventProductOrderComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EventProductOrderDetailComponent,
    resolve: {
      eventProductOrder: EventProductOrderRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EventProductOrderUpdateComponent,
    resolve: {
      eventProductOrder: EventProductOrderRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EventProductOrderUpdateComponent,
    resolve: {
      eventProductOrder: EventProductOrderRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(eventProductOrderRoute)],
  exports: [RouterModule],
})
export class EventProductOrderRoutingModule {}
