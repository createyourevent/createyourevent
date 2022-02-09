import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { SharedModule } from 'app/shared/shared.module';
import { TillComponent } from './till.component';

@NgModule({
  imports: [SharedModule, MatCardModule],
  declarations: [TillComponent],
  exports: [TillComponent]
})
export class TillModule {}
