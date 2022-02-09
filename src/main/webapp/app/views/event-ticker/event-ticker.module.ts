import { APP_INITIALIZER, NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { EventTickerComponent } from './event-ticker.component';
import { EventTickerService } from './event-ticker.service';

export function tagCloudProviderFactory(provider: EventTickerService): Function {
  return (): Promise<any> => {
    return provider.load();
  };
}

@NgModule({
  imports: [SharedModule],
  declarations: [EventTickerComponent],
  exports: [EventTickerComponent],
  providers: [
    EventTickerService,
    { provide: APP_INITIALIZER, useFactory: tagCloudProviderFactory, deps: [EventTickerService], multi: true }
  ]
})
export class EventTickerModule {}
