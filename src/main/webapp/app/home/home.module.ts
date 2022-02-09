import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { HOME_ROUTE } from './home.route';
import { HomeComponent } from './home.component';
import { ShopSliderModule } from 'app/views/boxes/shop_slider/shop_slider.module';
import { EventSliderModule } from '../views/boxes/event_slider/event_slider.module';
import { ServiceSliderModule } from 'app/views/boxes/service_slider/service_slider.module';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { AccordionModule } from 'primeng/accordion';
import { CarouselModule } from 'primeng/carousel';
import { MatCardModule } from '@angular/material/card';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatExpansionModule } from '@angular/material/expansion';
import { LuckySpinModule } from 'app/views/games/luckySpin/luckySpin.module';
import { AdsenseModule } from 'ng2-adsense';
import { Organization_sliderModule } from 'app/views/boxes/organization_slider/organization_slider.module';

@NgModule({
  imports: [
    SharedModule,
    NgbModule,
    MatCardModule,
    CarouselModule,
    RouterModule.forChild([HOME_ROUTE]),
    ShopSliderModule,
    EventSliderModule,
    ServiceSliderModule,
    DialogModule,
    ButtonModule,
    Organization_sliderModule,
    DropdownModule,
    AccordionModule,
    MatExpansionModule,
    LuckySpinModule,
    AdsenseModule.forRoot({
      adClient: 'ca-pub-7640562161899788',
      adSlot: 3790348225,
    }),
  ],
  declarations: [HomeComponent]
})
export class CreateyoureventHomeModule {}
