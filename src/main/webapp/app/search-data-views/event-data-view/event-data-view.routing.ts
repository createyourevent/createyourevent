import { Routes, RouterModule } from '@angular/router';
import { EventDataViewComponent } from './event-data-view.component';

const routes: Routes = [
  {
    path: '',
    component: EventDataViewComponent,
    data: {
      authorities: [],
      pageTitle: 'event-data-view.title'
    }
  }
];

export const EventDataViewRoutes = RouterModule.forChild(routes);
