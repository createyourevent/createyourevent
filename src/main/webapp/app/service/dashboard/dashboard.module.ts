import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { DashboardComponent } from './dashboard.component';
import { DASHBOARD_ROUTE } from './dashboard.route';

import { InputSwitchModule } from 'primeng/inputswitch';
import { ToastModule } from 'primeng/toast';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([DASHBOARD_ROUTE]), InputSwitchModule, ToastModule],
  declarations: [DashboardComponent]
})
export class DashboardModule {}
