import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { RouterModule } from '@angular/router';
import { DASHBOARD_ORGANIZATION_ROUTE } from './dashboard.route';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(DASHBOARD_ORGANIZATION_ROUTE)
  ],
  declarations: [DashboardComponent]
})
export class DashboardModule { }
