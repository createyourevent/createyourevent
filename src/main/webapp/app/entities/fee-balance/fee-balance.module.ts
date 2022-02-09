import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { FeeBalanceComponent } from './list/fee-balance.component';
import { FeeBalanceDetailComponent } from './detail/fee-balance-detail.component';
import { FeeBalanceUpdateComponent } from './update/fee-balance-update.component';
import { FeeBalanceDeleteDialogComponent } from './delete/fee-balance-delete-dialog.component';
import { FeeBalanceRoutingModule } from './route/fee-balance-routing.module';

@NgModule({
  imports: [SharedModule, FeeBalanceRoutingModule],
  declarations: [FeeBalanceComponent, FeeBalanceDetailComponent, FeeBalanceUpdateComponent, FeeBalanceDeleteDialogComponent],
  entryComponents: [FeeBalanceDeleteDialogComponent],
})
export class FeeBalanceModule {}
