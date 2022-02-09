import { Routes, RouterModule } from '@angular/router';
import { OrganizationDataViewComponent } from './organization-data-view.component';

const routes: Routes = [
  {
    path: '',
    component: OrganizationDataViewComponent,
    data: {
      authorities: [],
      pageTitle: 'organization-data-view.title'
    }
  }
];

export const OrganizationDataViewRoutes = RouterModule.forChild(routes);
