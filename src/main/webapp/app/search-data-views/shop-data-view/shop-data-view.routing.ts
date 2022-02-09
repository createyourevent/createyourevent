import { Routes, RouterModule } from '@angular/router';
import { ShopDataViewComponent } from './shop-data-view.component';

const routes: Routes = [
  {
    path: '',
    component: ShopDataViewComponent,
    data: {
      authorities: [],
      pageTitle: 'shop-data-view.title'
    }
  }
];

export const ShopDataViewRoutes = RouterModule.forChild(routes);
