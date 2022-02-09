import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { FeeTransactionIdComponent } from '../list/fee-transaction-id.component';
import { FeeTransactionIdDetailComponent } from '../detail/fee-transaction-id-detail.component';
import { FeeTransactionIdUpdateComponent } from '../update/fee-transaction-id-update.component';
import { FeeTransactionIdRoutingResolveService } from './fee-transaction-id-routing-resolve.service';

const feeTransactionIdRoute: Routes = [
  {
    path: '',
    component: FeeTransactionIdComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FeeTransactionIdDetailComponent,
    resolve: {
      feeTransactionId: FeeTransactionIdRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FeeTransactionIdUpdateComponent,
    resolve: {
      feeTransactionId: FeeTransactionIdRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FeeTransactionIdUpdateComponent,
    resolve: {
      feeTransactionId: FeeTransactionIdRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(feeTransactionIdRoute)],
  exports: [RouterModule],
})
export class FeeTransactionIdRoutingModule {}
