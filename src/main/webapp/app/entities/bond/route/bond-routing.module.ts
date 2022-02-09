import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { BondComponent } from '../list/bond.component';
import { BondDetailComponent } from '../detail/bond-detail.component';
import { BondUpdateComponent } from '../update/bond-update.component';
import { BondRoutingResolveService } from './bond-routing-resolve.service';

const bondRoute: Routes = [
  {
    path: '',
    component: BondComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BondDetailComponent,
    resolve: {
      bond: BondRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BondUpdateComponent,
    resolve: {
      bond: BondRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BondUpdateComponent,
    resolve: {
      bond: BondRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(bondRoute)],
  exports: [RouterModule],
})
export class BondRoutingModule {}
