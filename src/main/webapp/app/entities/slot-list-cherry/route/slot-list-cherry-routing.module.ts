import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SlotListCherryComponent } from '../list/slot-list-cherry.component';
import { SlotListCherryDetailComponent } from '../detail/slot-list-cherry-detail.component';
import { SlotListCherryUpdateComponent } from '../update/slot-list-cherry-update.component';
import { SlotListCherryRoutingResolveService } from './slot-list-cherry-routing-resolve.service';

const slotListCherryRoute: Routes = [
  {
    path: '',
    component: SlotListCherryComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SlotListCherryDetailComponent,
    resolve: {
      slotListCherry: SlotListCherryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SlotListCherryUpdateComponent,
    resolve: {
      slotListCherry: SlotListCherryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SlotListCherryUpdateComponent,
    resolve: {
      slotListCherry: SlotListCherryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(slotListCherryRoute)],
  exports: [RouterModule],
})
export class SlotListCherryRoutingModule {}
