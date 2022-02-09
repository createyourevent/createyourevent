import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MobileAppComponent } from './mobile-app.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { MOBILEAPP_ROUTE } from './mobile-app.routing';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([MOBILEAPP_ROUTE]),
  ],
  declarations: [MobileAppComponent]
})
export class MobileAppModule { }
