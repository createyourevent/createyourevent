import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizationDataViewComponent } from './organization-data-view.component';
import { DataViewModule } from 'primeng/dataview';
import { SharedModule } from 'app/shared/shared.module';
import { InputTextModule } from 'primeng/inputtext';
import { KnobModule } from 'primeng/knob';
import { OrganizationDataViewRoutes } from './organization-data-view.routing';
import { SelectDropDownModule } from 'ngx-select-dropdown'


@NgModule({
  imports: [
    CommonModule, SharedModule, DataViewModule, OrganizationDataViewRoutes, InputTextModule, KnobModule, SelectDropDownModule
  ],
  declarations: [OrganizationDataViewComponent]
})
export class OrganizationDataViewModule { }
