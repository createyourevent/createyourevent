import { Routes, RouterModule } from '@angular/router';
import { SchaffhausenHomeComponent } from './schaffhausenHome.component';

const routes: Routes = [
  {
    path: '',
    component: SchaffhausenHomeComponent,
    data: {
      authorities: [],
      pageTitle: 'routes.impressum.title'
    }
  }
];

export const SchaffhausenHomeRoutes = RouterModule.forChild(routes);
