import { SharedModule } from 'app/shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PayItForwardAdminComponent } from './pay-it-forward-admin.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { PayItForwardAdminRoutes } from './pay-it-forward-admin.routing';

@NgModule({
  imports: [
    CommonModule,
    InputNumberModule,
    SharedModule,
    PayItForwardAdminRoutes
  ],
  declarations: [PayItForwardAdminComponent]
})
export class PayItForwardAdminModule { }
