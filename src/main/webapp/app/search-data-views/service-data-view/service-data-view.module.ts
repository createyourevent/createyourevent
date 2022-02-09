import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceDataViewComponent } from './service-data-view.component';
import { DataViewModule } from 'primeng/dataview';
import { InputTextModule } from 'primeng/inputtext';
import { ServiceDataViewRoutes } from './service-data-view.routing';
import { SharedModule } from 'app/shared/shared.module';
import { KnobModule } from 'primeng/knob';

@NgModule({
  imports: [
    CommonModule,
    DataViewModule,
    InputTextModule,
    ServiceDataViewRoutes,
    SharedModule,
    KnobModule
  ],
  declarations: [ServiceDataViewComponent]
})
export class ServiceDataViewModule { }
