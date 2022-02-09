import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizationHasEventsComponent } from './organization-has-events.component';
import { DataViewModule } from 'primeng/dataview';
import { SharedModule } from 'app/shared/shared.module';
import { InputTextModule } from 'primeng/inputtext';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    DataViewModule,
    InputTextModule
  ],
  declarations: [OrganizationHasEventsComponent],
  exports: [OrganizationHasEventsComponent]
})
export class OrganizationHasEventsModule { }
