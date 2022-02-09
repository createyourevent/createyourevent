import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Organization_sliderComponent } from './organization_slider.component';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import { ToastModule } from 'primeng/toast';

@NgModule({
  imports: [
    CommonModule, FormsModule, CarouselModule, ButtonModule, ToastModule, MatCardModule
  ],
  declarations: [Organization_sliderComponent],
  exports: [Organization_sliderComponent]
})
export class Organization_sliderModule { }
