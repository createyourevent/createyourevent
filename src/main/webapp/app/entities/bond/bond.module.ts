import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { BondComponent } from './list/bond.component';
import { BondDetailComponent } from './detail/bond-detail.component';
import { BondUpdateComponent } from './update/bond-update.component';
import { BondDeleteDialogComponent } from './delete/bond-delete-dialog.component';
import { BondRoutingModule } from './route/bond-routing.module';

@NgModule({
  imports: [SharedModule, BondRoutingModule],
  declarations: [BondComponent, BondDetailComponent, BondUpdateComponent, BondDeleteDialogComponent],
})
export class BondModule {}
