import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AdminFeesPriceComponent } from '../list/admin-fees-price.component';
import { AdminFeesPriceDetailComponent } from '../detail/admin-fees-price-detail.component';
import { AdminFeesPriceUpdateComponent } from '../update/admin-fees-price-update.component';
import { AdminFeesPriceRoutingResolveService } from './admin-fees-price-routing-resolve.service';

const adminFeesPriceRoute: Routes = [
  {
    path: '',
    component: AdminFeesPriceComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AdminFeesPriceDetailComponent,
    resolve: {
      adminFeesPrice: AdminFeesPriceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AdminFeesPriceUpdateComponent,
    resolve: {
      adminFeesPrice: AdminFeesPriceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AdminFeesPriceUpdateComponent,
    resolve: {
      adminFeesPrice: AdminFeesPriceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(adminFeesPriceRoute)],
  exports: [RouterModule],
})
export class AdminFeesPriceRoutingModule {}
