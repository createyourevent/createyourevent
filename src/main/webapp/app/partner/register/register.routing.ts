import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './register.component';

const routes: Routes = [
  {
    path: '',
    component: RegisterComponent,
    data: {
      authorities: [],
      pageTitle: 'routes.register.partner.title'
    }
  }
];

export const RegisterRoutes = RouterModule.forChild(routes);
