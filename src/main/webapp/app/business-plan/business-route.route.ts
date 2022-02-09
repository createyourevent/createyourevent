import { Route } from '@angular/router';

import { BusinessPlanComponent } from './business-plan.component';

export const BUSINESSPLAN_ROUTE: Route = {
  path: '',
  component: BusinessPlanComponent,
  data: {
    pageTitle: 'routes.businessplan.title'
  }
};
