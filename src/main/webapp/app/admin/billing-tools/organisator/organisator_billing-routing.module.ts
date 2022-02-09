import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrganisatorBillingComponent } from './organisator_billing.component';
import { SharedModule } from 'app/shared/shared.module';


const routes: Routes = [{path: '', component: OrganisatorBillingComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  exports: [RouterModule]
})
export class OrganisatorBillingRoutingModule { }
