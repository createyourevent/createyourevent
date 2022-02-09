import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { OrganizationStarRatingComponent } from '../list/organization-star-rating.component';
import { OrganizationStarRatingDetailComponent } from '../detail/organization-star-rating-detail.component';
import { OrganizationStarRatingUpdateComponent } from '../update/organization-star-rating-update.component';
import { OrganizationStarRatingRoutingResolveService } from './organization-star-rating-routing-resolve.service';

const organizationStarRatingRoute: Routes = [
  {
    path: '',
    component: OrganizationStarRatingComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: OrganizationStarRatingDetailComponent,
    resolve: {
      organizationStarRating: OrganizationStarRatingRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: OrganizationStarRatingUpdateComponent,
    resolve: {
      organizationStarRating: OrganizationStarRatingRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: OrganizationStarRatingUpdateComponent,
    resolve: {
      organizationStarRating: OrganizationStarRatingRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(organizationStarRatingRoute)],
  exports: [RouterModule],
})
export class OrganizationStarRatingRoutingModule {}
