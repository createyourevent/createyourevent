import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { OrganizationStarRatingComponent } from './list/organization-star-rating.component';
import { OrganizationStarRatingDetailComponent } from './detail/organization-star-rating-detail.component';
import { OrganizationStarRatingUpdateComponent } from './update/organization-star-rating-update.component';
import { OrganizationStarRatingDeleteDialogComponent } from './delete/organization-star-rating-delete-dialog.component';
import { OrganizationStarRatingRoutingModule } from './route/organization-star-rating-routing.module';

@NgModule({
  imports: [SharedModule, OrganizationStarRatingRoutingModule],
  declarations: [
    OrganizationStarRatingComponent,
    OrganizationStarRatingDetailComponent,
    OrganizationStarRatingUpdateComponent,
    OrganizationStarRatingDeleteDialogComponent,
  ],
})
export class OrganizationStarRatingModule {}
