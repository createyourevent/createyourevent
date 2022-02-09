import { Routes } from '@angular/router';
import { AddRideCostsComponent } from './add-ride-costs.component';
import { NewServiceMapsComponent } from './new-service-maps.component';
import { ServiceMapsComponent } from './service-maps.component';
import { ServiceOffersComponent } from './service-offers.component';


export const SERVICE_MAPS_ROUTE: Routes = [
  {
    path: ':serviceId',
    component: ServiceMapsComponent,
    data: {
      authorities: [],
      pageTitle: 'routes.service-maps.title'
    }
  },
  {
    path: 'service-offers/:serviceId/:serviceMapId',
    component: ServiceOffersComponent,
    data: {
      authorities: [],
      pageTitle: 'routes.service-maps.offers.new.title'
    }
  },
  {
    path: 'new/:serviceId',
    component: NewServiceMapsComponent,
    data: {
      authorities: [],
      pageTitle: 'routes.service-maps.new.title'
    }
  },
  {
    path: 'addRideCosts/:serviceId/:serviceMapId',
    component: AddRideCostsComponent,
    data: {
      authorities: [],
      pageTitle: 'routes.add-ride-costs.new.title'
    }
  }
];
