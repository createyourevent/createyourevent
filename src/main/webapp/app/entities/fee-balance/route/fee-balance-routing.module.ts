import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { FeeBalanceComponent } from '../list/fee-balance.component';
import { FeeBalanceDetailComponent } from '../detail/fee-balance-detail.component';
import { FeeBalanceUpdateComponent } from '../update/fee-balance-update.component';
import { FeeBalanceRoutingResolveService } from './fee-balance-routing-resolve.service';

const feeBalanceRoute: Routes = [
  {
    path: '',
    component: FeeBalanceComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FeeBalanceDetailComponent,
    resolve: {
      feeBalance: FeeBalanceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FeeBalanceUpdateComponent,
    resolve: {
      feeBalance: FeeBalanceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FeeBalanceUpdateComponent,
    resolve: {
      feeBalance: FeeBalanceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(feeBalanceRoute)],
  exports: [RouterModule],
})
export class FeeBalanceRoutingModule {}
