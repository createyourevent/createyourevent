import { Route } from '@angular/router';

import { MapComponent } from './map.component';

export const MAP_ROUTE: Route = {
  path: '',
  component: MapComponent,
  data: {
    authorities: [],
    pageTitle: 'routes.map.title'
  }
};
