import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { EventDetailsComponent } from './list/event-details.component';
import { EventDetailsDetailComponent } from './detail/event-details-detail.component';
import { EventDetailsUpdateComponent } from './update/event-details-update.component';
import { EventDetailsDeleteDialogComponent } from './delete/event-details-delete-dialog.component';
import { EventDetailsRoutingModule } from './route/event-details-routing.module';

@NgModule({
  imports: [SharedModule, EventDetailsRoutingModule],
  declarations: [EventDetailsComponent, EventDetailsDetailComponent, EventDetailsUpdateComponent, EventDetailsDeleteDialogComponent],
  entryComponents: [EventDetailsDeleteDialogComponent],
})
export class EventDetailsModule {}
