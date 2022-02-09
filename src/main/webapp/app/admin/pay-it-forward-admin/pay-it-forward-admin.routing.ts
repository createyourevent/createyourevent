import { Routes, RouterModule } from '@angular/router';
import { PayItForwardAdminComponent } from './pay-it-forward-admin.component';

const routes: Routes = [
  {
    path: '',
    component: PayItForwardAdminComponent,
    data: {
      authorities: [],
      pageTitle: 'pay-it-forward-admin.title'
    }
   },
];

export const PayItForwardAdminRoutes = RouterModule.forChild(routes);
