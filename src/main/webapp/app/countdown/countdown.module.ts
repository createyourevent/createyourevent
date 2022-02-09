import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { CountdownTimerComponent } from './countdown.component';

@NgModule({
  imports: [SharedModule],
  declarations: [CountdownTimerComponent],
  exports: [CountdownTimerComponent]
})
export class CountdownTimerModule {}
