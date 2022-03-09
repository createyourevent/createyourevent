import { Routes, RouterModule } from '@angular/router';
import { CouponsComponent } from './coupons.component';

const routes: Routes = [
  {
    path: '',
    component: CouponsComponent,
    data: {
      authorities: [],
      pageTitle: 'home.title',
    },
  },
];

export const CouponsRoutes = RouterModule.forChild(routes);
