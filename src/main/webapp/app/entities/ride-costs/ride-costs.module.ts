import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { RideCostsComponent } from './list/ride-costs.component';
import { RideCostsDetailComponent } from './detail/ride-costs-detail.component';
import { RideCostsUpdateComponent } from './update/ride-costs-update.component';
import { RideCostsDeleteDialogComponent } from './delete/ride-costs-delete-dialog.component';
import { RideCostsRoutingModule } from './route/ride-costs-routing.module';

@NgModule({
  imports: [SharedModule, RideCostsRoutingModule],
  declarations: [RideCostsComponent, RideCostsDetailComponent, RideCostsUpdateComponent, RideCostsDeleteDialogComponent],
  entryComponents: [RideCostsDeleteDialogComponent],
})
export class RideCostsModule {}
