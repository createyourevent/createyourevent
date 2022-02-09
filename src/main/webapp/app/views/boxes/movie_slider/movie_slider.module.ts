import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieSliderComponent } from './movie_slider.component';
import { SharedModule } from 'app/shared/shared.module';
import { CarouselModule } from 'primeng/carousel';

@NgModule({
  imports: [CommonModule, SharedModule, CarouselModule],
  declarations: [MovieSliderComponent],
  exports: [MovieSliderComponent]
})
export class MovieSliderModule {}
