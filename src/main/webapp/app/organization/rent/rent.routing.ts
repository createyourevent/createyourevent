import { Routes, RouterModule } from '@angular/router';
import { Authority } from 'app/config/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { RentComponent } from './rent.component';

const routes: Routes = [
  {
    path: 'organization/:id/rent-club',
    component: RentComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'routes.dashboard-organization.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'organization/:id/rent-hotel',
    component: RentComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'routes.dashboard-organization.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'organization/:id/rent-restaurant',
    component: RentComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'routes.dashboard-organization.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'organization/:id/rent-building',
    component: RentComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'routes.dashboard-organization.title',
    },
    canActivate: [UserRouteAccessService],
  },
];

export const RentRoutes = RouterModule.forChild(routes);
