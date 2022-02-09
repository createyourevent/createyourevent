import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { FeeTransactionComponent } from './list/fee-transaction.component';
import { FeeTransactionDetailComponent } from './detail/fee-transaction-detail.component';
import { FeeTransactionUpdateComponent } from './update/fee-transaction-update.component';
import { FeeTransactionDeleteDialogComponent } from './delete/fee-transaction-delete-dialog.component';
import { FeeTransactionRoutingModule } from './route/fee-transaction-routing.module';

@NgModule({
  imports: [SharedModule, FeeTransactionRoutingModule],
  declarations: [
    FeeTransactionComponent,
    FeeTransactionDetailComponent,
    FeeTransactionUpdateComponent,
    FeeTransactionDeleteDialogComponent,
  ],
  entryComponents: [FeeTransactionDeleteDialogComponent],
})
export class FeeTransactionModule {}
