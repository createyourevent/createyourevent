import { Route } from '@angular/router';
import { PrintBondComponent } from './print-bond.component';


export const PRINTBOND_ROUTE: Route = {
  path: 'admin/:bondId/print-bond',
  component: PrintBondComponent,
  data: {
    authorities: [],
    pageTitle: 'home.title'
  }
};
