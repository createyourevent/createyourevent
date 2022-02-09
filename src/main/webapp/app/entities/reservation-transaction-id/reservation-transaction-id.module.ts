import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ReservationTransactionIdComponent } from './list/reservation-transaction-id.component';
import { ReservationTransactionIdDetailComponent } from './detail/reservation-transaction-id-detail.component';
import { ReservationTransactionIdUpdateComponent } from './update/reservation-transaction-id-update.component';
import { ReservationTransactionIdDeleteDialogComponent } from './delete/reservation-transaction-id-delete-dialog.component';
import { ReservationTransactionIdRoutingModule } from './route/reservation-transaction-id-routing.module';

@NgModule({
  imports: [SharedModule, ReservationTransactionIdRoutingModule],
  declarations: [
    ReservationTransactionIdComponent,
    ReservationTransactionIdDetailComponent,
    ReservationTransactionIdUpdateComponent,
    ReservationTransactionIdDeleteDialogComponent,
  ],
  entryComponents: [ReservationTransactionIdDeleteDialogComponent],
})
export class ReservationTransactionIdModule {}
