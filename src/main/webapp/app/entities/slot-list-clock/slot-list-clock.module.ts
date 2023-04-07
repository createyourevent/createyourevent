import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SlotListClockComponent } from './list/slot-list-clock.component';
import { SlotListClockDetailComponent } from './detail/slot-list-clock-detail.component';
import { SlotListClockUpdateComponent } from './update/slot-list-clock-update.component';
import { SlotListClockDeleteDialogComponent } from './delete/slot-list-clock-delete-dialog.component';
import { SlotListClockRoutingModule } from './route/slot-list-clock-routing.module';

@NgModule({
  imports: [SharedModule, SlotListClockRoutingModule],
  declarations: [SlotListClockComponent, SlotListClockDetailComponent, SlotListClockUpdateComponent, SlotListClockDeleteDialogComponent],
})
export class SlotListClockModule {}
