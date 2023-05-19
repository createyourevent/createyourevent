import { APP_INITIALIZER, NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { EventTickerComponent } from './event-ticker.component';
import { EventTickerService } from './event-ticker.service';

@NgModule({
  imports: [SharedModule],
  declarations: [EventTickerComponent],
  exports: [EventTickerComponent],
})
export class EventTickerModule {}
