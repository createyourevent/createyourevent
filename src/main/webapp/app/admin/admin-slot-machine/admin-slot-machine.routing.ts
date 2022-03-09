import { Routes, RouterModule } from '@angular/router';
import { AdminSlotMachineComponent } from './admin-slot-machine.component';

const routes: Routes = [
  {
    path: '',
    component: AdminSlotMachineComponent,
    data: {
      authorities: [],
      pageTitle: 'home.title',
    },
  },
];

export const AdminSlotMachineRoutes = RouterModule.forChild(routes);
