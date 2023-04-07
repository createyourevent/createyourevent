import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ProductStarRatingComponent } from './list/product-star-rating.component';
import { ProductStarRatingDetailComponent } from './detail/product-star-rating-detail.component';
import { ProductStarRatingUpdateComponent } from './update/product-star-rating-update.component';
import { ProductStarRatingDeleteDialogComponent } from './delete/product-star-rating-delete-dialog.component';
import { ProductStarRatingRoutingModule } from './route/product-star-rating-routing.module';

@NgModule({
  imports: [SharedModule, ProductStarRatingRoutingModule],
  declarations: [
    ProductStarRatingComponent,
    ProductStarRatingDetailComponent,
    ProductStarRatingUpdateComponent,
    ProductStarRatingDeleteDialogComponent,
  ],
})
export class ProductStarRatingModule {}
