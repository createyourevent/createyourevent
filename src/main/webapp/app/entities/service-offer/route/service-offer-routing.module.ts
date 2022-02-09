import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ServiceOfferComponent } from '../list/service-offer.component';
import { ServiceOfferDetailComponent } from '../detail/service-offer-detail.component';
import { ServiceOfferUpdateComponent } from '../update/service-offer-update.component';
import { ServiceOfferRoutingResolveService } from './service-offer-routing-resolve.service';

const serviceOfferRoute: Routes = [
  {
    path: '',
    component: ServiceOfferComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ServiceOfferDetailComponent,
    resolve: {
      serviceOffer: ServiceOfferRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ServiceOfferUpdateComponent,
    resolve: {
      serviceOffer: ServiceOfferRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ServiceOfferUpdateComponent,
    resolve: {
      serviceOffer: ServiceOfferRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(serviceOfferRoute)],
  exports: [RouterModule],
})
export class ServiceOfferRoutingModule {}
