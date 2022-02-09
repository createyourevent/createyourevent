import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PartnerAdsSliderComponent } from './partner_ads_slider.component';
import { SharedModule } from 'app/shared/shared.module';
import { CarouselModule } from 'primeng/carousel';

@NgModule({
  imports: [CommonModule, SharedModule, CarouselModule],
  declarations: [PartnerAdsSliderComponent],
  exports: [PartnerAdsSliderComponent]
})
export class PartnerAdsSliderModule {}
