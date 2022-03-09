import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SlotListCherryComponent } from './list/slot-list-cherry.component';
import { SlotListCherryDetailComponent } from './detail/slot-list-cherry-detail.component';
import { SlotListCherryUpdateComponent } from './update/slot-list-cherry-update.component';
import { SlotListCherryDeleteDialogComponent } from './delete/slot-list-cherry-delete-dialog.component';
import { SlotListCherryRoutingModule } from './route/slot-list-cherry-routing.module';

@NgModule({
  imports: [SharedModule, SlotListCherryRoutingModule],
  declarations: [
    SlotListCherryComponent,
    SlotListCherryDetailComponent,
    SlotListCherryUpdateComponent,
    SlotListCherryDeleteDialogComponent,
  ],
  entryComponents: [SlotListCherryDeleteDialogComponent],
})
export class SlotListCherryModule {}
