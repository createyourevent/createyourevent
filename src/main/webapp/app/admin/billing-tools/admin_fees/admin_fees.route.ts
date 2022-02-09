import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { AdminFeesComponent } from './admin_fees.component';


const routes: Routes = [{path: '', component: AdminFeesComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  exports: [RouterModule]
})
export class AdminFeesRoutingModule { }
