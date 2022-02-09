import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { FeeTransactionEntryComponent } from '../list/fee-transaction-entry.component';
import { FeeTransactionEntryDetailComponent } from '../detail/fee-transaction-entry-detail.component';
import { FeeTransactionEntryUpdateComponent } from '../update/fee-transaction-entry-update.component';
import { FeeTransactionEntryRoutingResolveService } from './fee-transaction-entry-routing-resolve.service';

const feeTransactionEntryRoute: Routes = [
  {
    path: '',
    component: FeeTransactionEntryComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FeeTransactionEntryDetailComponent,
    resolve: {
      feeTransactionEntry: FeeTransactionEntryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FeeTransactionEntryUpdateComponent,
    resolve: {
      feeTransactionEntry: FeeTransactionEntryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FeeTransactionEntryUpdateComponent,
    resolve: {
      feeTransactionEntry: FeeTransactionEntryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(feeTransactionEntryRoute)],
  exports: [RouterModule],
})
export class FeeTransactionEntryRoutingModule {}
