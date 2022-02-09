import { Route } from '@angular/router';
import { CreateServiceComponent } from './create-service.component';


export const CREATE_SERVICE_ROUTE: Route = {
  path: '',
  component: CreateServiceComponent,
  data: {
    authorities: [],
    pageTitle: 'routes.create-service.title'
  }
};
