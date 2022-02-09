import { Routes, RouterModule } from '@angular/router';
import { Authority } from 'app/config/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { DashboardOrganizationComponent } from './admin-dashboard-organization.component';

const routes: Routes = [
  {
    path: 'organization/dashboard-restaurant/admin/:organizationId',
    component: DashboardOrganizationComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'routes.dashboard-organization-admin.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'organization/dashboard-hotel/admin/:organizationId',
    component: DashboardOrganizationComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'routes.dashboard-organization-admin.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'organization/dashboard-club/admin/:organizationId',
    component: DashboardOrganizationComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'routes.dashboard-organization-admin.title'
    },
    canActivate: [UserRouteAccessService]
  },
];

export const AdminDashboardOrganizationRoutes = RouterModule.forChild(routes);
