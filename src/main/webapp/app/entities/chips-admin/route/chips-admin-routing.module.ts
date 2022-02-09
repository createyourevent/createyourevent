import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ChipsAdminComponent } from '../list/chips-admin.component';
import { ChipsAdminDetailComponent } from '../detail/chips-admin-detail.component';
import { ChipsAdminUpdateComponent } from '../update/chips-admin-update.component';
import { ChipsAdminRoutingResolveService } from './chips-admin-routing-resolve.service';

const chipsAdminRoute: Routes = [
  {
    path: '',
    component: ChipsAdminComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ChipsAdminDetailComponent,
    resolve: {
      chipsAdmin: ChipsAdminRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ChipsAdminUpdateComponent,
    resolve: {
      chipsAdmin: ChipsAdminRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ChipsAdminUpdateComponent,
    resolve: {
      chipsAdmin: ChipsAdminRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(chipsAdminRoute)],
  exports: [RouterModule],
})
export class ChipsAdminRoutingModule {}
