import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { BUSINESSPLAN_ROUTE } from './business-route.route';
import { BusinessPlanComponent } from './business-plan.component';
import { ShopSliderModule } from                                                                                                                                                                                                                                                                                                                                   'app/views/boxes/shop_slider/shop_slider.module';
import { EventSliderModule } from '../views/boxes/event_slider/event_slider.module';
import { ServiceSliderModule } from 'app/views/boxes/service_slider/service_slider.module';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { AccordionModule } from 'primeng/accordion';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([BUSINESSPLAN_ROUTE]), ShopSliderModule, EventSliderModule, ServiceSliderModule, DialogModule, ButtonModule, DropdownModule, AccordionModule],
  declarations: [BusinessPlanComponent],
  exports: [RouterModule]
})
export class BusinessPlanModule {}
