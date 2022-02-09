import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PayItForwardComponent } from './pay-it-forward.component';
import { SharedModule } from 'app/shared/shared.module';
import { PayItForwardRoutes } from './pay-it-forward.routing';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    PayItForwardRoutes
  ],
  declarations: [PayItForwardComponent]
})
export class PayItForwardModule { }
