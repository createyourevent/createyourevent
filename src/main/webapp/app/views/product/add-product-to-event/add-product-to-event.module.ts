import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'app/shared/shared.module';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { SelectDropDownModule } from 'ngx-select-dropdown'
import { ButtonModule } from 'primeng/button';
import { AddProductToEventComponent } from './add-product-to-event.component';
import { TillModule } from 'app/views/till/till.module';
import { ToastModule } from 'primeng/toast';
import { NgxCurrencyModule } from 'ngx-currency';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    TabViewModule,
    TableModule,
    FormsModule,
    SelectDropDownModule,
    ButtonModule,
    TillModule,
    ToastModule,
    NgxCurrencyModule
  ],
  declarations: [AddProductToEventComponent],
  exports: [AddProductToEventComponent],
})
export class AddProductToEventModule { }
