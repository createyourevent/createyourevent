import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MatCardModule } from '@angular/material/card';
import { ProductSliderComponent } from './product__slider.component';
import { PriceTypeModule } from 'app/views/type-flags/price-type/price-type.module';

@NgModule({
  imports: [SharedModule, FormsModule, CarouselModule, ButtonModule, ToastModule, MatCardModule, PriceTypeModule],
  declarations: [ProductSliderComponent],
  exports: [ProductSliderComponent]
})
export class ProductSliderModule {}
