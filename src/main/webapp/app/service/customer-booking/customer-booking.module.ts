import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SharedModule } from 'app/shared/shared.module';
import { CustomerBookingComponent } from './customer-booking.component';
import { DropdownModule } from 'primeng/dropdown';
import { CUSTOMER_BOOKING_ROUTE } from './customer-booking.route';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { ToggleButtonModule } from 'primeng/togglebutton';


@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(CUSTOMER_BOOKING_ROUTE),
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    DropdownModule,
    CardModule,
    TabViewModule,
    ToggleButtonModule
  ],
  declarations: [CustomerBookingComponent]
})
export class CustomerBookingModule {}
