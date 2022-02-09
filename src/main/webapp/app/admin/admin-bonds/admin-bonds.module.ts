import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminBondsComponent } from './admin-bonds.component';
import { ADMINBONDS_ROUTE } from './admin-bonds.routing';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { FieldsetModule } from 'primeng/fieldset';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([ADMINBONDS_ROUTE]),
    FieldsetModule,
    InputNumberModule,
    InputTextareaModule,
    ButtonModule,
    TableModule
  ],
  declarations: [AdminBondsComponent]
})
export class AdminBondsModule { }
