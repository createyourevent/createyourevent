import { Routes, RouterModule } from '@angular/router';
import { CreateyoureventTvComponent } from './createyourevent-tv.component';

const routes: Routes = [
  {
    path: '',
    component: CreateyoureventTvComponent,
    data: {
      authorities: [],
      pageTitle: 'routes.tv.title'
    }
  }
];

export const CreateyoureventTvRoutes = RouterModule.forChild(routes);
