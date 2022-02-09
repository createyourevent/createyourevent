import { Routes } from '@angular/router';
import { Authority } from 'app/config/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { DashboardSupplierShopComponent } from './admin-dashboard-supplier-shop/admin-dashboard-supplier-shop.component';

export const shopRoute: Routes = [
  {
    path: ':shopId/dashboard-shop',
    component: DashboardSupplierShopComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'createyoureventApp.event.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];
