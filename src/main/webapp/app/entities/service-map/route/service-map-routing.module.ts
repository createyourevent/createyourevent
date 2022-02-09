import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ServiceMapComponent } from '../list/service-map.component';
import { ServiceMapDetailComponent } from '../detail/service-map-detail.component';
import { ServiceMapUpdateComponent } from '../update/service-map-update.component';
import { ServiceMapRoutingResolveService } from './service-map-routing-resolve.service';

const serviceMapRoute: Routes = [
  {
    path: '',
    component: ServiceMapComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ServiceMapDetailComponent,
    resolve: {
      serviceMap: ServiceMapRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ServiceMapUpdateComponent,
    resolve: {
      serviceMap: ServiceMapRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ServiceMapUpdateComponent,
    resolve: {
      serviceMap: ServiceMapRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(serviceMapRoute)],
  exports: [RouterModule],
})
export class ServiceMapRoutingModule {}
