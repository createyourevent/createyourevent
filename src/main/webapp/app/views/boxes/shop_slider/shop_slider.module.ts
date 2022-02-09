import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ShopSliderComponent } from './shop__slider.component';
import { FormsModule } from '@angular/forms';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  imports: [SharedModule, FormsModule, CarouselModule, ButtonModule, ToastModule, MatCardModule],
  declarations: [ShopSliderComponent],
  exports: [ShopSliderComponent]
})
export class ShopSliderModule {}
