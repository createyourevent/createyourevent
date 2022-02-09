import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { OrganizationReservationComponent } from '../list/organization-reservation.component';
import { OrganizationReservationDetailComponent } from '../detail/organization-reservation-detail.component';
import { OrganizationReservationUpdateComponent } from '../update/organization-reservation-update.component';
import { OrganizationReservationRoutingResolveService } from './organization-reservation-routing-resolve.service';

const organizationReservationRoute: Routes = [
  {
    path: '',
    component: OrganizationReservationComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: OrganizationReservationDetailComponent,
    resolve: {
      organizationReservation: OrganizationReservationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: OrganizationReservationUpdateComponent,
    resolve: {
      organizationReservation: OrganizationReservationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: OrganizationReservationUpdateComponent,
    resolve: {
      organizationReservation: OrganizationReservationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(organizationReservationRoute)],
  exports: [RouterModule],
})
export class OrganizationReservationRoutingModule {}
