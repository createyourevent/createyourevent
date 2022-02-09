import { Route } from '@angular/router';
import { OrdersComponent } from './orders.component';

export const ORDERS_ROUTE: Route = {
  path: ':id',
  component: OrdersComponent,
  data: {
    authorities: [],
    pageTitle: 'routes.orders.title'
  }
};
