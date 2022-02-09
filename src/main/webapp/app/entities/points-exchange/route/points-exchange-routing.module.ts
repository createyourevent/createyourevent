import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PointsExchangeComponent } from '../list/points-exchange.component';
import { PointsExchangeDetailComponent } from '../detail/points-exchange-detail.component';
import { PointsExchangeUpdateComponent } from '../update/points-exchange-update.component';
import { PointsExchangeRoutingResolveService } from './points-exchange-routing-resolve.service';

const pointsExchangeRoute: Routes = [
  {
    path: '',
    component: PointsExchangeComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PointsExchangeDetailComponent,
    resolve: {
      pointsExchange: PointsExchangeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PointsExchangeUpdateComponent,
    resolve: {
      pointsExchange: PointsExchangeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PointsExchangeUpdateComponent,
    resolve: {
      pointsExchange: PointsExchangeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(pointsExchangeRoute)],
  exports: [RouterModule],
})
export class PointsExchangeRoutingModule {}
