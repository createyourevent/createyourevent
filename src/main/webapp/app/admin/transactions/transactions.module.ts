import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionsComponent } from './transactions.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { TabViewModule } from 'primeng/tabview';
import { TRANSACTIONS_ROUTE } from './transactions.routing';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { SelectDropDownModule } from 'ngx-select-dropdown'
import { ButtonModule } from 'primeng/button';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(TRANSACTIONS_ROUTE),
    TabViewModule,
    TableModule,
    FormsModule,
    SelectDropDownModule,
    ButtonModule
  ],
  declarations: [TransactionsComponent]
})
export class TransactionsModule { }
