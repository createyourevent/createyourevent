import { Routes, RouterModule } from '@angular/router';
import { Authority } from 'app/config/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CashboxComponent } from './cashbox.component';

const routes: Routes = [
  {
    path: ':eventId/cashbox',
    component: CashboxComponent,
    data: {
      authorities: [Authority.ORGANISATOR],
      pageTitle: 'routes.title.cashbox'
    },
    canActivate: [UserRouteAccessService]
  },
];

export const CashboxRoutes = RouterModule.forChild(routes);
