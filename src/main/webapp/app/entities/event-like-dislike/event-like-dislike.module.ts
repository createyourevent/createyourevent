import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { EventLikeDislikeComponent } from './list/event-like-dislike.component';
import { EventLikeDislikeDetailComponent } from './detail/event-like-dislike-detail.component';
import { EventLikeDislikeUpdateComponent } from './update/event-like-dislike-update.component';
import { EventLikeDislikeDeleteDialogComponent } from './delete/event-like-dislike-delete-dialog.component';
import { EventLikeDislikeRoutingModule } from './route/event-like-dislike-routing.module';

@NgModule({
  imports: [SharedModule, EventLikeDislikeRoutingModule],
  declarations: [
    EventLikeDislikeComponent,
    EventLikeDislikeDetailComponent,
    EventLikeDislikeUpdateComponent,
    EventLikeDislikeDeleteDialogComponent,
  ],
})
export class EventLikeDislikeModule {}
