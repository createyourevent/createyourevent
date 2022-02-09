import { Routes, RouterModule } from '@angular/router';
import { Authority } from 'app/config/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ClubRoutingResolveService } from 'app/entities/club/route/club-routing-resolve.service';
import { HotelRoutingResolveService } from 'app/entities/hotel/route/hotel-routing-resolve.service';
import { RestaurantRoutingResolveService } from 'app/entities/restaurant/route/restaurant-routing-resolve.service';
import { ViewClubComponent } from './club/view-club.component';
import { ViewHotelComponent } from './hotel/view-hotel.component';
import { ViewRestaurantComponent } from './restaurant/view-restaurant.component';

const routes: Routes = [
  {
    path: 'organization/:id/hotel',
    component: ViewHotelComponent,
    resolve: {
      hotel: HotelRoutingResolveService,
    },
    data: {
      pageTitle: 'routes.view-hotel.title'
    },
  },
  {
    path: 'organization/:id/club',
    component: ViewClubComponent,
    resolve: {
      club: ClubRoutingResolveService,
    },
    data: {
      pageTitle: 'routes.view-club.title'
    },
  },
  {
    path: 'organization/:id/restaurant',
    component: ViewRestaurantComponent,
    resolve: {
      restaurant: RestaurantRoutingResolveService,
    },
    data: {
      pageTitle: 'routes.view-restaurant.title'
    },
  },
];

export const ViewOrganizationRoutes = RouterModule.forChild(routes);
