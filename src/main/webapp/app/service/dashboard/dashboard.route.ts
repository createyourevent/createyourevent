import { Route } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { DashboardComponent } from './dashboard.component';


export const DASHBOARD_ROUTE: Route = {
  path: '',
  component: DashboardComponent,
  resolve: {
    pagingParams: JhiResolvePagingParams
  },
  data: {
    authorities: [],
    pageTitle: 'routes.dashboard.service.title'
  }
};
