import { Routes, RouterModule } from '@angular/router';
import { AdminPointsComponent } from './admin-points.component';

const routes: Routes = [
  {
    path: '',
    component: AdminPointsComponent,
    data: {
      authorities: [],
      pageTitle: 'admin-points.title'
    }
  }
];

export const AdminPointsRoutes = RouterModule.forChild(routes);
