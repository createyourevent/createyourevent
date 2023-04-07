import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { EventProductRatingCommentComponent } from './list/event-product-rating-comment.component';
import { EventProductRatingCommentDetailComponent } from './detail/event-product-rating-comment-detail.component';
import { EventProductRatingCommentUpdateComponent } from './update/event-product-rating-comment-update.component';
import { EventProductRatingCommentDeleteDialogComponent } from './delete/event-product-rating-comment-delete-dialog.component';
import { EventProductRatingCommentRoutingModule } from './route/event-product-rating-comment-routing.module';

@NgModule({
  imports: [SharedModule, EventProductRatingCommentRoutingModule],
  declarations: [
    EventProductRatingCommentComponent,
    EventProductRatingCommentDetailComponent,
    EventProductRatingCommentUpdateComponent,
    EventProductRatingCommentDeleteDialogComponent,
  ],
})
export class EventProductRatingCommentModule {}
