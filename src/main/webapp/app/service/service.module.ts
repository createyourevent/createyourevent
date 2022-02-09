import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CUSTOMER_BOOKING_ROUTE } from './customer-booking/customer-booking.route';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'create-service',
        loadChildren: () => import('./create-service/create-service.module').then(m => m.CreateServiceModule)
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'service-maps',
        loadChildren: () => import('./service-maps/service-maps.module').then(m => m.ServiceMapsModule)
      },
      {
        path: ':serviceId/customer-booking',
        loadChildren: () => import('./customer-booking/customer-booking.module').then(m => m.CustomerBookingModule)
      }
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]
    ),
    RouterModule.forChild(CUSTOMER_BOOKING_ROUTE),
    
  ]
})
export class ServiceModule {}
