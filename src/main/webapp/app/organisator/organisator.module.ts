import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OfferOrganisatorModule } from './offer-organisator/offer-organisator.module';
import { OfferModule } from 'app/views/offer/offer.module';

@NgModule({
  imports: [
    OfferOrganisatorModule,
    OfferModule,
    RouterModule.forChild([
      {
        path: 'create-event',
        loadChildren: () => import('./create-event/create-event.module').then(m => m.CreateEventModule)
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard_organisator/dashboard_organisator.module').then(m => m.DashboardOrganisatorModule)
      },
      {
        path: 'guest-reservation',
        loadChildren: () => import('./guest-reservation/guest-reservation.module').then(m => m.GuestReservationModule)
      },
      {
        path: 'offers',
        loadChildren: () => import('./offer-organisator/offer-organisator.module').then(m => m.OfferOrganisatorModule)
      },
      {
        path: 'cashbox',
        loadChildren: () => import('./cashbox/cashbox.module').then(m => m.CashboxModule)
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ])
  ],
})
export class OrganisatorModule {}
