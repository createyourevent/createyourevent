import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationsComponent } from './locations.component';
import { RestaurantsComponent } from './restaurants/restaurants.component';
import { BuildingsComponent } from './buildings/buildings.component';
import { ClubsComponent } from './clubs/clubs.component';
import { HotelsComponent } from './hotels/hotels.component';
import { SharedModule } from 'app/shared/shared.module';
import { LocationsRoutes } from './locations.routing';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    LocationsRoutes
  ],
  declarations: [LocationsComponent, BuildingsComponent, HotelsComponent, ClubsComponent, RestaurantsComponent,]
})
export class LocationsModule { }
