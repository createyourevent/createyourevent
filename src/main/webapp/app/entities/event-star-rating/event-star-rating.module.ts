import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { EventStarRatingComponent } from './list/event-star-rating.component';
import { EventStarRatingDetailComponent } from './detail/event-star-rating-detail.component';
import { EventStarRatingUpdateComponent } from './update/event-star-rating-update.component';
import { EventStarRatingDeleteDialogComponent } from './delete/event-star-rating-delete-dialog.component';
import { EventStarRatingRoutingModule } from './route/event-star-rating-routing.module';

@NgModule({
  imports: [SharedModule, EventStarRatingRoutingModule],
  declarations: [
    EventStarRatingComponent,
    EventStarRatingDetailComponent,
    EventStarRatingUpdateComponent,
    EventStarRatingDeleteDialogComponent,
  ],
  entryComponents: [EventStarRatingDeleteDialogComponent],
})
export class EventStarRatingModule {}
