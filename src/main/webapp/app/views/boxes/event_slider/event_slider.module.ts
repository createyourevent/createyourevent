import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MatCardModule } from '@angular/material/card';
import { EventSliderComponent } from './event__slider.component';
import { CountdownTimerModule } from 'app/countdown/countdown.module';

@NgModule({
  imports: [SharedModule, FormsModule, CarouselModule, ButtonModule, ToastModule, MatCardModule,  CountdownTimerModule],
  declarations: [EventSliderComponent],
  exports: [EventSliderComponent]
})
export class EventSliderModule {}
