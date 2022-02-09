import { Routes, RouterModule } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AdminTetrisComponent } from './admin-tetris.component';

const TETRIS_ADMIN_ROUTE: Routes = [
  {
    path: '',
    component: AdminTetrisComponent,
    data: {
      authorities: ['ROLE_ADMIN'],
      pageTitle: 'adminTetris.title'
    },
    canActivate: [UserRouteAccessService],
  },
];

export const PointsRoutes = RouterModule.forChild(TETRIS_ADMIN_ROUTE);
