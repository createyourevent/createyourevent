import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { GiftShoppingCartComponent } from '../list/gift-shopping-cart.component';
import { GiftShoppingCartDetailComponent } from '../detail/gift-shopping-cart-detail.component';
import { GiftShoppingCartUpdateComponent } from '../update/gift-shopping-cart-update.component';
import { GiftShoppingCartRoutingResolveService } from './gift-shopping-cart-routing-resolve.service';

const giftShoppingCartRoute: Routes = [
  {
    path: '',
    component: GiftShoppingCartComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: GiftShoppingCartDetailComponent,
    resolve: {
      giftShoppingCart: GiftShoppingCartRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: GiftShoppingCartUpdateComponent,
    resolve: {
      giftShoppingCart: GiftShoppingCartRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: GiftShoppingCartUpdateComponent,
    resolve: {
      giftShoppingCart: GiftShoppingCartRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(giftShoppingCartRoute)],
  exports: [RouterModule],
})
export class GiftShoppingCartRoutingModule {}
