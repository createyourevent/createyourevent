import { Routes, RouterModule } from '@angular/router';
import { ProductDataViewComponent } from './product-data-view.component';

const routes: Routes = [
  {
    path: '',
    component: ProductDataViewComponent,
    data: {
      authorities: [],
      pageTitle: 'product-data-view.title'
    }
  }
];

export const ProductDataViewRoutes = RouterModule.forChild(routes);
