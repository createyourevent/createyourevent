import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { GiftComponent } from '../list/gift.component';
import { GiftDetailComponent } from '../detail/gift-detail.component';
import { GiftUpdateComponent } from '../update/gift-update.component';
import { GiftRoutingResolveService } from './gift-routing-resolve.service';

const giftRoute: Routes = [
  {
    path: '',
    component: GiftComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: GiftDetailComponent,
    resolve: {
      gift: GiftRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: GiftUpdateComponent,
    resolve: {
      gift: GiftRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: GiftUpdateComponent,
    resolve: {
      gift: GiftRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(giftRoute)],
  exports: [RouterModule],
})
export class GiftRoutingModule {}
