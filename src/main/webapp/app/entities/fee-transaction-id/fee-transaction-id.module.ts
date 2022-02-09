import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { FeeTransactionIdComponent } from './list/fee-transaction-id.component';
import { FeeTransactionIdDetailComponent } from './detail/fee-transaction-id-detail.component';
import { FeeTransactionIdUpdateComponent } from './update/fee-transaction-id-update.component';
import { FeeTransactionIdDeleteDialogComponent } from './delete/fee-transaction-id-delete-dialog.component';
import { FeeTransactionIdRoutingModule } from './route/fee-transaction-id-routing.module';

@NgModule({
  imports: [SharedModule, FeeTransactionIdRoutingModule],
  declarations: [
    FeeTransactionIdComponent,
    FeeTransactionIdDetailComponent,
    FeeTransactionIdUpdateComponent,
    FeeTransactionIdDeleteDialogComponent,
  ],
  entryComponents: [FeeTransactionIdDeleteDialogComponent],
})
export class FeeTransactionIdModule {}
