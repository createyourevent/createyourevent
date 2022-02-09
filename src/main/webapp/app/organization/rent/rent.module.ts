import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RentComponent } from './rent.component';
import { SharedModule } from 'app/shared/shared.module';
import { CardModule } from 'primeng/card';
import { RentRoutes } from './rent.routing';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputSwitchModule } from 'primeng/inputswitch';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CardModule,
    RentRoutes,
    TableModule,
    ButtonModule,
    InputSwitchModule
  ],
  declarations: [RentComponent]
})
export class RentModule { }
