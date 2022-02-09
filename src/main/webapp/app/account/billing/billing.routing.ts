import { Routes, RouterModule } from '@angular/router';
import { Authority } from 'app/config/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { BillingComponent } from './billing.component';

export const routesBilling: Routes = [
  {
    path: 'billing',
    component: BillingComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'global.menu.account.settings'
    },
    canActivate: [UserRouteAccessService]
  },
];
