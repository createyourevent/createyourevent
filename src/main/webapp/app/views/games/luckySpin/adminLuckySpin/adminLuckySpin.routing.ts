import { Routes, RouterModule } from '@angular/router';
import { AdminLuckySpinComponent } from './adminLuckySpin.component';

const routes: Routes = [
  {
    path: '',
    component: AdminLuckySpinComponent,
    data: {
      authorities: ['ROLE_ADMIN'],
      pageTitle: 'adminLuckySpin.title'
    }
   },
];

export const AdminLuckySpinRoutes = RouterModule.forChild(routes);
