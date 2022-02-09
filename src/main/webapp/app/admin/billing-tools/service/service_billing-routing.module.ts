import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { ServiceBillingComponent } from './service_billing.component';


const routes: Routes = [{path: '', component: ServiceBillingComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  exports: [RouterModule]
})
export class ServiceBillingRoutingModule { }
