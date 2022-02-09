import { Route } from '@angular/router';

import { InstructionsComponent } from './instructions.component';

export const INSTRUCTIONS_ROUTE: Route = {
  path: '',
  component: InstructionsComponent,
  data: {
    authorities: [],
    pageTitle: 'routes.instructions.title'
  }
};
