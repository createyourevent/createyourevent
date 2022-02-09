import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { SupplierBillingComponent } from './suppllier_billing.component';


const routes: Routes = [{path: '', component: SupplierBillingComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  exports: [RouterModule]
})
export class SupplierBillingRoutingModule { }
