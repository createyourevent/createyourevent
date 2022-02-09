import { Routes, RouterModule } from '@angular/router';
import { ChipsOverviewComponent } from './chips-overview.component';

const chipsOverviewRoutes: Routes = [
  {
    path: '',
    component: ChipsOverviewComponent,
    data: {
      pageTitle: 'routes.chips-overview.title'
    },
  },
];

export const ChipsOverviewRoutes = RouterModule.forChild(chipsOverviewRoutes);
