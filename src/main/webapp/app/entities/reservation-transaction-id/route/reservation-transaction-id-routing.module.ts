import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ReservationTransactionIdComponent } from '../list/reservation-transaction-id.component';
import { ReservationTransactionIdDetailComponent } from '../detail/reservation-transaction-id-detail.component';
import { ReservationTransactionIdUpdateComponent } from '../update/reservation-transaction-id-update.component';
import { ReservationTransactionIdRoutingResolveService } from './reservation-transaction-id-routing-resolve.service';

const reservationTransactionIdRoute: Routes = [
  {
    path: '',
    component: ReservationTransactionIdComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ReservationTransactionIdDetailComponent,
    resolve: {
      reservationTransactionId: ReservationTransactionIdRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ReservationTransactionIdUpdateComponent,
    resolve: {
      reservationTransactionId: ReservationTransactionIdRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ReservationTransactionIdUpdateComponent,
    resolve: {
      reservationTransactionId: ReservationTransactionIdRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(reservationTransactionIdRoute)],
  exports: [RouterModule],
})
export class ReservationTransactionIdRoutingModule {}
