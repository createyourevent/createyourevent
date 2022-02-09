import { Route } from '@angular/router';

import { OfferOrganisatorComponent } from './offer-organisator.component';

export const OFFER_ROUTE: Route = {
  path: ':eventId/offer',
  component: OfferOrganisatorComponent,
  data: {
    authorities: [],
    pageTitle: 'offer.title'
  }
};
