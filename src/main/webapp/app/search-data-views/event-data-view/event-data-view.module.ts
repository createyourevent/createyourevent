import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventDataViewComponent } from './event-data-view.component';
import { DataViewModule } from 'primeng/dataview';
import { SharedModule } from 'app/shared/shared.module';
import { EventDataViewRoutes } from './event-data-view.routing';
import { InputTextModule } from 'primeng/inputtext';
import { KnobModule } from 'primeng/knob';

@NgModule({
  imports: [CommonModule, SharedModule, DataViewModule, EventDataViewRoutes, InputTextModule, KnobModule],
  declarations: [EventDataViewComponent]
})
export class EventDataViewModule {}
