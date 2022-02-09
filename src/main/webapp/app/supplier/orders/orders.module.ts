import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { OrdersComponent } from './orders.component';
import { ORDERS_ROUTE } from './orders.route';

import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { TabViewModule } from 'primeng/tabview';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([ORDERS_ROUTE]), MatCardModule, MatToolbarModule, MatIconModule, TabViewModule, ToggleButtonModule],
  declarations: [OrdersComponent]
})
export class OrdersModule {}
