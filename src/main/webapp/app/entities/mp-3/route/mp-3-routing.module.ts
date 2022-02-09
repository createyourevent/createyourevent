import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { Mp3Component } from '../list/mp-3.component';
import { Mp3DetailComponent } from '../detail/mp-3-detail.component';
import { Mp3UpdateComponent } from '../update/mp-3-update.component';
import { Mp3RoutingResolveService } from './mp-3-routing-resolve.service';

const mp3Route: Routes = [
  {
    path: '',
    component: Mp3Component,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: Mp3DetailComponent,
    resolve: {
      mp3: Mp3RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: Mp3UpdateComponent,
    resolve: {
      mp3: Mp3RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: Mp3UpdateComponent,
    resolve: {
      mp3: Mp3RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(mp3Route)],
  exports: [RouterModule],
})
export class Mp3RoutingModule {}
