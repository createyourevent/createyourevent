import { Routes, RouterModule } from '@angular/router';
import { TetrisComponent } from './tetris.component';

const routes: Routes = [
  { 
    path: '',
    component: TetrisComponent,
    data: {
      pageTitle: 'navbar.tetris'
    }
   },
];

export const TetrisRoutes = RouterModule.forChild(routes);
