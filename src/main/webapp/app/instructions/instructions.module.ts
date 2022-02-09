import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { INSTRUCTIONS_ROUTE } from './instructions.route';
import { InstructionsComponent } from './instructions.component';
import { ShopSliderModule } from 'app/views/boxes/shop_slider/shop_slider.module';
import { EventSliderModule } from '../views/boxes/event_slider/event_slider.module';
import { ServiceSliderModule } from 'app/views/boxes/service_slider/service_slider.module';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { AccordionModule } from 'primeng/accordion';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([INSTRUCTIONS_ROUTE]), ShopSliderModule, EventSliderModule, ServiceSliderModule, DialogModule, ButtonModule, DropdownModule, AccordionModule],
  declarations: [InstructionsComponent]
})
export class InstructionsModule {}
