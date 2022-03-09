import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SlotListOrangeComponent } from '../list/slot-list-orange.component';
import { SlotListOrangeDetailComponent } from '../detail/slot-list-orange-detail.component';
import { SlotListOrangeUpdateComponent } from '../update/slot-list-orange-update.component';
import { SlotListOrangeRoutingResolveService } from './slot-list-orange-routing-resolve.service';

const slotListOrangeRoute: Routes = [
  {
    path: '',
    component: SlotListOrangeComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SlotListOrangeDetailComponent,
    resolve: {
      slotListOrange: SlotListOrangeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SlotListOrangeUpdateComponent,
    resolve: {
      slotListOrange: SlotListOrangeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SlotListOrangeUpdateComponent,
    resolve: {
      slotListOrange: SlotListOrangeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(slotListOrangeRoute)],
  exports: [RouterModule],
})
export class SlotListOrangeRoutingModule {}
