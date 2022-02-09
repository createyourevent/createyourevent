import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { EventCommentComponent } from './list/event-comment.component';
import { EventCommentDetailComponent } from './detail/event-comment-detail.component';
import { EventCommentUpdateComponent } from './update/event-comment-update.component';
import { EventCommentDeleteDialogComponent } from './delete/event-comment-delete-dialog.component';
import { EventCommentRoutingModule } from './route/event-comment-routing.module';

@NgModule({
  imports: [SharedModule, EventCommentRoutingModule],
  declarations: [EventCommentComponent, EventCommentDetailComponent, EventCommentUpdateComponent, EventCommentDeleteDialogComponent],
  entryComponents: [EventCommentDeleteDialogComponent],
})
export class EventCommentModule {}
