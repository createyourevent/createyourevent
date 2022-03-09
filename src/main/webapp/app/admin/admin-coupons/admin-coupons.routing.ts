import { Routes, RouterModule } from '@angular/router';
import { AdminCouponsComponent } from './admin-coupons.component';

const routes: Routes = [
  {
    path: '',
    component: AdminCouponsComponent,
    data: {
      authorities: [],
      pageTitle: 'home.title',
    },
  },
];

export const AdminCouponsRoutes = RouterModule.forChild(routes);
