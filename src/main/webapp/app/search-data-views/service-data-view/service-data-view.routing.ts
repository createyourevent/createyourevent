import { Routes, RouterModule } from '@angular/router';
import { ServiceDataViewComponent } from './service-data-view.component';

const routes: Routes = [
  {
    path: '',
    component: ServiceDataViewComponent,
    data: {
      authorities: [],
      pageTitle: 'service-data-view.title'
    }
  }
];

export const ServiceDataViewRoutes = RouterModule.forChild(routes);
