import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { GuestReservationComponent } from './guest-reservation.component';
import { GUEST_RESERVATION_ROUTE } from './guest-reservation.route';

import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { GuestReservationDetailComponent } from './guest-reservation-detail.component';
import { GuestReservationDeleteDialogComponent } from './guest-reservation-delete-dialog.component';
import { ReservationCounterModule } from 'app/views/reservation-counter/reservation-counter.module';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import {ToastModule} from 'primeng/toast';

@NgModule({
  imports: [
    ReservationCounterModule,
    SharedModule,
    RouterModule.forChild(GUEST_RESERVATION_ROUTE),
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    NgxQRCodeModule,
    ToastModule
  ],
  declarations: [GuestReservationComponent, GuestReservationDetailComponent, GuestReservationDeleteDialogComponent],
  entryComponents: [GuestReservationDeleteDialogComponent]
})
export class GuestReservationModule {}
