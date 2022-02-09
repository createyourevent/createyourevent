import { Routes, RouterModule } from '@angular/router';
import { PartnerComponent } from './partner.component';

const routes: Routes = [
  {
    path: '',
    component: PartnerComponent,
    data: {
      authorities: [],
      pageTitle: 'routes.partner.title'
    }
  }
];

export const PartnerRoutes = RouterModule.forChild(routes);
