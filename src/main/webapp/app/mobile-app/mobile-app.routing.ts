import { Route } from '@angular/router';
import { MobileAppComponent } from './mobile-app.component';

export const MOBILEAPP_ROUTE: Route = {
  path: '',
  component: MobileAppComponent,
  data: {
    authorities: [],
    pageTitle: 'home.title'
  }
};
