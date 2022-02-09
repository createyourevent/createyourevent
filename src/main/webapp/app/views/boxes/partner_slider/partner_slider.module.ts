import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PartnerSliderComponent } from './partner_slider.component';
import { CarouselModule } from 'primeng/carousel';
import { SharedModule } from 'app/shared/shared.module';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';

@NgModule({
  imports: [CommonModule, CarouselModule, SharedModule, NgxQRCodeModule],
  declarations: [PartnerSliderComponent],
  exports: [PartnerSliderComponent]
})
export class PartnerSliderModule {}
