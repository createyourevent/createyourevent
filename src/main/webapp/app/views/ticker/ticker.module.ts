import { APP_INITIALIZER, NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { TickerComponent } from './ticker.component';
import { TickerService } from './ticker.service';
import { NgxMarqueeModule } from 'ngx-marquee';

@NgModule({
  imports: [SharedModule, NgxMarqueeModule],
  declarations: [TickerComponent],
  exports: [TickerComponent],
})
export class TickerModule {}
