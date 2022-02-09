import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CreateYourEventServiceComponent } from '../list/create-your-event-service.component';
import { CreateYourEventServiceDetailComponent } from '../detail/create-your-event-service-detail.component';
import { CreateYourEventServiceUpdateComponent } from '../update/create-your-event-service-update.component';
import { CreateYourEventServiceRoutingResolveService } from './create-your-event-service-routing-resolve.service';

const createYourEventServiceRoute: Routes = [
  {
    path: '',
    component: CreateYourEventServiceComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CreateYourEventServiceDetailComponent,
    resolve: {
      createYourEventService: CreateYourEventServiceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CreateYourEventServiceUpdateComponent,
    resolve: {
      createYourEventService: CreateYourEventServiceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CreateYourEventServiceUpdateComponent,
    resolve: {
      createYourEventService: CreateYourEventServiceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(createYourEventServiceRoute)],
  exports: [RouterModule],
})
export class CreateYourEventServiceRoutingModule {}
