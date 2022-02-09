import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoute } from './dashboard.route';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { MatToolbarModule } from '@angular/material/toolbar';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ToastModule } from 'primeng/toast';


@NgModule({
  declarations: [DashboardComponent],
  imports: [SharedModule, CommonModule, RouterModule.forChild(DashboardRoute), MatToolbarModule, InputSwitchModule, ToastModule]
})
export class DashboardModule {}
