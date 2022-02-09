import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ChipsComponent } from '../list/chips.component';
import { ChipsDetailComponent } from '../detail/chips-detail.component';
import { ChipsUpdateComponent } from '../update/chips-update.component';
import { ChipsRoutingResolveService } from './chips-routing-resolve.service';

const chipsRoute: Routes = [
  {
    path: '',
    component: ChipsComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ChipsDetailComponent,
    resolve: {
      chips: ChipsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ChipsUpdateComponent,
    resolve: {
      chips: ChipsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ChipsUpdateComponent,
    resolve: {
      chips: ChipsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(chipsRoute)],
  exports: [RouterModule],
})
export class ChipsRoutingModule {}
