import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SlotListOrangeComponent } from './list/slot-list-orange.component';
import { SlotListOrangeDetailComponent } from './detail/slot-list-orange-detail.component';
import { SlotListOrangeUpdateComponent } from './update/slot-list-orange-update.component';
import { SlotListOrangeDeleteDialogComponent } from './delete/slot-list-orange-delete-dialog.component';
import { SlotListOrangeRoutingModule } from './route/slot-list-orange-routing.module';

@NgModule({
  imports: [SharedModule, SlotListOrangeRoutingModule],
  declarations: [
    SlotListOrangeComponent,
    SlotListOrangeDetailComponent,
    SlotListOrangeUpdateComponent,
    SlotListOrangeDeleteDialogComponent,
  ],
})
export class SlotListOrangeModule {}
