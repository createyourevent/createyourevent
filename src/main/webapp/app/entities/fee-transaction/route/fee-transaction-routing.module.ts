import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { FeeTransactionComponent } from '../list/fee-transaction.component';
import { FeeTransactionDetailComponent } from '../detail/fee-transaction-detail.component';
import { FeeTransactionUpdateComponent } from '../update/fee-transaction-update.component';
import { FeeTransactionRoutingResolveService } from './fee-transaction-routing-resolve.service';

const feeTransactionRoute: Routes = [
  {
    path: '',
    component: FeeTransactionComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FeeTransactionDetailComponent,
    resolve: {
      feeTransaction: FeeTransactionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FeeTransactionUpdateComponent,
    resolve: {
      feeTransaction: FeeTransactionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FeeTransactionUpdateComponent,
    resolve: {
      feeTransaction: FeeTransactionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(feeTransactionRoute)],
  exports: [RouterModule],
})
export class FeeTransactionRoutingModule {}
