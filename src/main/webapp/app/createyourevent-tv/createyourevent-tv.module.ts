import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateyoureventTvComponent } from './createyourevent-tv.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'app/shared/shared.module';
import { CarouselModule } from 'primeng/carousel';
import { CreateyoureventTvRoutes } from './createyourevent-tv.routing';
import { PriceTypeModule } from 'app/views/type-flags/price-type/price-type.module';

@NgModule({
  imports: [CommonModule, SharedModule, FormsModule, CarouselModule, CreateyoureventTvRoutes, PriceTypeModule],
  declarations: [CreateyoureventTvComponent]
})
export class CreateyoureventTvModule {}
