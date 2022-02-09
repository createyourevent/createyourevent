import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { FeeTransactionEntryComponent } from './list/fee-transaction-entry.component';
import { FeeTransactionEntryDetailComponent } from './detail/fee-transaction-entry-detail.component';
import { FeeTransactionEntryUpdateComponent } from './update/fee-transaction-entry-update.component';
import { FeeTransactionEntryDeleteDialogComponent } from './delete/fee-transaction-entry-delete-dialog.component';
import { FeeTransactionEntryRoutingModule } from './route/fee-transaction-entry-routing.module';

@NgModule({
  imports: [SharedModule, FeeTransactionEntryRoutingModule],
  declarations: [
    FeeTransactionEntryComponent,
    FeeTransactionEntryDetailComponent,
    FeeTransactionEntryUpdateComponent,
    FeeTransactionEntryDeleteDialogComponent,
  ],
  entryComponents: [FeeTransactionEntryDeleteDialogComponent],
})
export class FeeTransactionEntryModule {}
