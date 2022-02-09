import { Routes } from '@angular/router';
import { Authority } from 'app/config/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CreateOrganizationComponent } from './create-organization.component';


export const CREATE_ORGANIZATION_ROUTE: Routes =  [{
  path: 'organization/register-organization',
  component: CreateOrganizationComponent,
  data: {
    authorities: [Authority.USER],
    pageTitle: 'routes.create-organization.title'
  },
  canActivate: [UserRouteAccessService]
},
];
