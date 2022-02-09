import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MatCardModule } from '@angular/material/card';
import { ServiceSliderComponent } from './service__slider.component';

@NgModule({
  imports: [SharedModule, FormsModule, CarouselModule, ButtonModule, ToastModule, MatCardModule],
  declarations: [ServiceSliderComponent],
  exports: [ServiceSliderComponent]
})
export class ServiceSliderModule {}
