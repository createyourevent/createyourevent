import { Routes, RouterModule } from '@angular/router';
import { RestaurantComponent } from 'app/entities/restaurant/list/restaurant.component';
import { BuildingsComponent } from './buildings/buildings.component';
import { ClubsComponent } from './clubs/clubs.component';
import { HotelsComponent } from './hotels/hotels.component';

const routes: Routes = [
  {
    path: 'buildings',
    component: BuildingsComponent,
    data: {
      authorities: [],
      pageTitle: 'routes.buildings.title'
    }
  },
  {
    path: 'restaurants',
    component: RestaurantComponent,
    data: {
      authorities: [],
      pageTitle: 'routes.restaurants.title'
    }
  },
  {
    path: 'hotels',
    component: HotelsComponent,
    data: {
      authorities: [],
      pageTitle: 'routes.hotels.title'
    }
  },
  {
    path: 'clubs',
    component: ClubsComponent,
    data: {
      authorities: [],
      pageTitle: 'routes.clubs.title'
    }
  },
];

export const LocationsRoutes = RouterModule.forChild(routes);
