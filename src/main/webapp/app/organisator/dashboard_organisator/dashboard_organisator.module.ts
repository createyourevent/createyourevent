import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardOrganisatorComponent } from './dashboard_organisator.component';
import { RouterModule } from '@angular/router';
import { DashboardRoute } from './dashboard_organisator.route';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SharedModule } from 'app/shared/shared.module';
import { MatCardModule } from '@angular/material/card';



@NgModule({
  declarations: [DashboardOrganisatorComponent],
  imports: [
    SharedModule,
    CommonModule,
    RouterModule.forChild(DashboardRoute),
    MatToolbarModule,
    MatCardModule
  ]
})
export class DashboardOrganisatorModule { }
