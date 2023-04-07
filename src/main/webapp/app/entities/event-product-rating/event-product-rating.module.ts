import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { EventProductRatingComponent } from './list/event-product-rating.component';
import { EventProductRatingDetailComponent } from './detail/event-product-rating-detail.component';
import { EventProductRatingUpdateComponent } from './update/event-product-rating-update.component';
import { EventProductRatingDeleteDialogComponent } from './delete/event-product-rating-delete-dialog.component';
import { EventProductRatingRoutingModule } from './route/event-product-rating-routing.module';

@NgModule({
  imports: [SharedModule, EventProductRatingRoutingModule],
  declarations: [
    EventProductRatingComponent,
    EventProductRatingDetailComponent,
    EventProductRatingUpdateComponent,
    EventProductRatingDeleteDialogComponent,
  ],
})
export class EventProductRatingModule {}
