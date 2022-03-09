import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SlotListClockComponent } from '../list/slot-list-clock.component';
import { SlotListClockDetailComponent } from '../detail/slot-list-clock-detail.component';
import { SlotListClockUpdateComponent } from '../update/slot-list-clock-update.component';
import { SlotListClockRoutingResolveService } from './slot-list-clock-routing-resolve.service';

const slotListClockRoute: Routes = [
  {
    path: '',
    component: SlotListClockComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SlotListClockDetailComponent,
    resolve: {
      slotListClock: SlotListClockRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SlotListClockUpdateComponent,
    resolve: {
      slotListClock: SlotListClockRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SlotListClockUpdateComponent,
    resolve: {
      slotListClock: SlotListClockRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(slotListClockRoute)],
  exports: [RouterModule],
})
export class SlotListClockRoutingModule {}
