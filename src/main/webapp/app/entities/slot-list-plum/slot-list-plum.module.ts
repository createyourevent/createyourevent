import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SlotListPlumComponent } from './list/slot-list-plum.component';
import { SlotListPlumDetailComponent } from './detail/slot-list-plum-detail.component';
import { SlotListPlumUpdateComponent } from './update/slot-list-plum-update.component';
import { SlotListPlumDeleteDialogComponent } from './delete/slot-list-plum-delete-dialog.component';
import { SlotListPlumRoutingModule } from './route/slot-list-plum-routing.module';

@NgModule({
  imports: [SharedModule, SlotListPlumRoutingModule],
  declarations: [SlotListPlumComponent, SlotListPlumDetailComponent, SlotListPlumUpdateComponent, SlotListPlumDeleteDialogComponent],
})
export class SlotListPlumModule {}
