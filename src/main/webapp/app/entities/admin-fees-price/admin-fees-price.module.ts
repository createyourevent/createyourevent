import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { AdminFeesPriceComponent } from './list/admin-fees-price.component';
import { AdminFeesPriceDetailComponent } from './detail/admin-fees-price-detail.component';
import { AdminFeesPriceUpdateComponent } from './update/admin-fees-price-update.component';
import { AdminFeesPriceDeleteDialogComponent } from './delete/admin-fees-price-delete-dialog.component';
import { AdminFeesPriceRoutingModule } from './route/admin-fees-price-routing.module';

@NgModule({
  imports: [SharedModule, AdminFeesPriceRoutingModule],
  declarations: [
    AdminFeesPriceComponent,
    AdminFeesPriceDetailComponent,
    AdminFeesPriceUpdateComponent,
    AdminFeesPriceDeleteDialogComponent,
  ],
  entryComponents: [AdminFeesPriceDeleteDialogComponent],
})
export class AdminFeesPriceModule {}
