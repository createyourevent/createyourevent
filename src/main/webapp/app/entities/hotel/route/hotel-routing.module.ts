import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { HotelComponent } from '../list/hotel.component';
import { HotelDetailComponent } from '../detail/hotel-detail.component';
import { HotelUpdateComponent } from '../update/hotel-update.component';
import { HotelRoutingResolveService } from './hotel-routing-resolve.service';

const hotelRoute: Routes = [
  {
    path: '',
    component: HotelComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: HotelDetailComponent,
    resolve: {
      hotel: HotelRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: HotelUpdateComponent,
    resolve: {
      hotel: HotelRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: HotelUpdateComponent,
    resolve: {
      hotel: HotelRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(hotelRoute)],
  exports: [RouterModule],
})
export class HotelRoutingModule {}
