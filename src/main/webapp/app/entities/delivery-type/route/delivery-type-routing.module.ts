import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { DeliveryTypeComponent } from '../list/delivery-type.component';
import { DeliveryTypeDetailComponent } from '../detail/delivery-type-detail.component';
import { DeliveryTypeUpdateComponent } from '../update/delivery-type-update.component';
import { DeliveryTypeRoutingResolveService } from './delivery-type-routing-resolve.service';

const deliveryTypeRoute: Routes = [
  {
    path: '',
    component: DeliveryTypeComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DeliveryTypeDetailComponent,
    resolve: {
      deliveryType: DeliveryTypeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DeliveryTypeUpdateComponent,
    resolve: {
      deliveryType: DeliveryTypeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DeliveryTypeUpdateComponent,
    resolve: {
      deliveryType: DeliveryTypeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(deliveryTypeRoute)],
  exports: [RouterModule],
})
export class DeliveryTypeRoutingModule {}
