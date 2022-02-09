import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopDataViewComponent } from './shop-data-view.component';
import { DataViewModule } from 'primeng/dataview';
import { InputTextModule } from 'primeng/inputtext';
import { ShopDataViewRoutes } from './shop-data-view.routing';
import { SharedModule } from 'app/shared/shared.module';
import { KnobModule } from 'primeng/knob';

@NgModule({
  imports: [
    CommonModule,
    DataViewModule,
    InputTextModule,
    ShopDataViewRoutes,
    SharedModule,
    KnobModule
  ],
  declarations: [ShopDataViewComponent]
})
export class ShopDataViewModule { }
