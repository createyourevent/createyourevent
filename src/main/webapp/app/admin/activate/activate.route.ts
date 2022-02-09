import { Route } from '@angular/router';

import { ActivateComponent } from './activate.component';

export const ACTIVATE_ROUTE: Route = {
  path: '',
  component: ActivateComponent,
  data: {
    authorities: [],
    pageTitle: 'home.title'
  }
};
