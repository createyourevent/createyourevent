import { Routes } from '@angular/router';
import { Authority } from 'app/config/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { DashboardComponent } from './dashboard.component';


export const DASHBOARD_ORGANIZATION_ROUTE: Routes =  [{
  path: 'organization/dashboard',
  component: DashboardComponent,
  data: {
    authorities: [Authority.USER],
    pageTitle: 'routes.dashboard-organization.title'
  },
  canActivate: [UserRouteAccessService]
},
];
