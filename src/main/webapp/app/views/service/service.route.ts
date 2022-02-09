import { Routes } from "@angular/router";
import { Authority } from "app/config/authority.constants";
import { UserRouteAccessService } from "app/core/auth/user-route-access.service";
import { DashboardServiceComponent } from "./admin-dashboard-service/admin-dashboard-service.component";
import { CreateYourEventServiceDetailComponent } from "./create-your-event-service-detail.component";
import { CreateYourEventServiceUpdateComponent } from "./create-your-event-service-update.component";


export const serviceRoute: Routes = [
  {
    path: ':serviceId/dashboard-service',
    component: DashboardServiceComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'createyoureventApp.event.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':serviceId/editService',
    component: CreateYourEventServiceUpdateComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'createyoureventApp.event.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':serviceId/viewService',
    component: CreateYourEventServiceDetailComponent,
    data: {
      pageTitle: 'createyoureventApp.event.home.title'
    }
  }
];
