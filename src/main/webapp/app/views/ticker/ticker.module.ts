import { APP_INITIALIZER, NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { TickerComponent } from './ticker.component';
import { TickerService } from './ticker.service';


export function tagCloudProviderFactory(provider: TickerService): Function{
  return (): Promise<any> => {
    return provider.load();
  }
}

@NgModule({
  imports: [SharedModule],
  declarations: [TickerComponent],
  exports: [TickerComponent],
  providers: [
    TickerService,
    { provide: APP_INITIALIZER, useFactory: tagCloudProviderFactory, deps: [TickerService], multi: true }
  ],
})
export class TickerModule {}
