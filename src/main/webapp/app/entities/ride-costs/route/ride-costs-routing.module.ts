import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { RideCostsComponent } from '../list/ride-costs.component';
import { RideCostsDetailComponent } from '../detail/ride-costs-detail.component';
import { RideCostsUpdateComponent } from '../update/ride-costs-update.component';
import { RideCostsRoutingResolveService } from './ride-costs-routing-resolve.service';

const rideCostsRoute: Routes = [
  {
    path: '',
    component: RideCostsComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: RideCostsDetailComponent,
    resolve: {
      rideCosts: RideCostsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: RideCostsUpdateComponent,
    resolve: {
      rideCosts: RideCostsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: RideCostsUpdateComponent,
    resolve: {
      rideCosts: RideCostsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(rideCostsRoute)],
  exports: [RouterModule],
})
export class RideCostsRoutingModule {}
