import { GMapModule } from 'primeng/gmap';
import { MAP_ROUTE } from './map.route';
import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { MapComponent } from './map.component';
import { MatTabsModule } from '@angular/material/tabs';
import { DistanceComponent } from './distance/distance.component';
import { SliderModule } from 'primeng/slider';
import { EventSliderModule } from 'app/views/boxes/event_slider/event_slider.module';
import { DistanceShopComponent } from './distance-shop/distance-shop.component';
import { ShopSliderModule } from 'app/views/boxes/shop_slider/shop_slider.module';
import { DistanceServiceComponent } from './distance-service/distance-service.component';
import { ServiceSliderModule } from '../views/boxes/service_slider/service_slider.module';
import { KnobModule } from 'primeng/knob';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([MAP_ROUTE]),
    GMapModule,
    MatTabsModule,
    SliderModule,
    EventSliderModule,
    ShopSliderModule,
    ServiceSliderModule,
    KnobModule
  ],
  declarations: [MapComponent, DistanceComponent, DistanceShopComponent, DistanceServiceComponent],
  exports: [MapComponent, RouterModule, DistanceComponent, DistanceShopComponent, DistanceServiceComponent]
})
export class MapModule {}
