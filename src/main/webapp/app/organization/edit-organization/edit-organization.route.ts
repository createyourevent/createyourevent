import { Routes } from '@angular/router';
import { Authority } from 'app/config/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { OrganizationRoutingResolveService } from 'app/entities/organization/route/organization-routing-resolve.service';
import { EditOrganizationComponent } from './edit-organization.component';


export const EDIT_ORGANIZATION_ROUTE: Routes =  [{
  path: 'organization/:id/edit-organization',
  component: EditOrganizationComponent,
  resolve: {
    organization: OrganizationRoutingResolveService,
  },
  data: {
    authorities: [Authority.USER],
    pageTitle: 'routes.create-organization.title'
  },
  canActivate: [UserRouteAccessService]
},
];
