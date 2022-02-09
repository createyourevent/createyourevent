import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminLuckySpinComponent } from './adminLuckySpin.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { AdminLuckySpinRoutes } from './adminLuckySpin.routing';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormlyModule.forRoot(),
    FormlyBootstrapModule,
    AdminLuckySpinRoutes
  ],
  declarations: [AdminLuckySpinComponent]
})
export class AdminLuckySpinModule { }
