import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ServiceStarRatingComponent } from './list/service-star-rating.component';
import { ServiceStarRatingDetailComponent } from './detail/service-star-rating-detail.component';
import { ServiceStarRatingUpdateComponent } from './update/service-star-rating-update.component';
import { ServiceStarRatingDeleteDialogComponent } from './delete/service-star-rating-delete-dialog.component';
import { ServiceStarRatingRoutingModule } from './route/service-star-rating-routing.module';

@NgModule({
  imports: [SharedModule, ServiceStarRatingRoutingModule],
  declarations: [
    ServiceStarRatingComponent,
    ServiceStarRatingDetailComponent,
    ServiceStarRatingUpdateComponent,
    ServiceStarRatingDeleteDialogComponent,
  ],
  entryComponents: [ServiceStarRatingDeleteDialogComponent],
})
export class ServiceStarRatingModule {}
