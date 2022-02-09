import { Routes, RouterModule } from '@angular/router';
import { PayItForwardComponent } from './pay-it-forward.component';

const routes: Routes = [
  {
    path: '',
    component: PayItForwardComponent,
    data: {
      authorities: [],
      pageTitle: 'pay-it-forward.title'
    }
   },
];

export const PayItForwardRoutes = RouterModule.forChild(routes);
