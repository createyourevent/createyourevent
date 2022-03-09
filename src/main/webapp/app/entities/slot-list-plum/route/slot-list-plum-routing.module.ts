import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SlotListPlumComponent } from '../list/slot-list-plum.component';
import { SlotListPlumDetailComponent } from '../detail/slot-list-plum-detail.component';
import { SlotListPlumUpdateComponent } from '../update/slot-list-plum-update.component';
import { SlotListPlumRoutingResolveService } from './slot-list-plum-routing-resolve.service';

const slotListPlumRoute: Routes = [
  {
    path: '',
    component: SlotListPlumComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SlotListPlumDetailComponent,
    resolve: {
      slotListPlum: SlotListPlumRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SlotListPlumUpdateComponent,
    resolve: {
      slotListPlum: SlotListPlumRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SlotListPlumUpdateComponent,
    resolve: {
      slotListPlum: SlotListPlumRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(slotListPlumRoute)],
  exports: [RouterModule],
})
export class SlotListPlumRoutingModule {}
