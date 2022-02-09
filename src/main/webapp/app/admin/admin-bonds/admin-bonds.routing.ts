import { Route } from '@angular/router';
import { AdminBondsComponent } from './admin-bonds.component';


export const ADMINBONDS_ROUTE: Route = {
  path: '',
  component:AdminBondsComponent,
  data: {
    authorities: [],
    pageTitle: 'home.title'
  }
};
