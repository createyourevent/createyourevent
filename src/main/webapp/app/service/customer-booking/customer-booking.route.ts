import { Routes } from '@angular/router';
import { CustomerBookingComponent } from './customer-booking.component';


export const CUSTOMER_BOOKING_ROUTE: Routes = [
  {
    path: '',
    component: CustomerBookingComponent,
    data: {
      authorities: [],
      pageTitle: 'routes.customer-booking.title'
    }
  },
  {
    path: ':serviceMapId',
    component: CustomerBookingComponent,
    data: {
      authorities: [],
      pageTitle: 'routes.customer-booking.title'
    }
  }
];
