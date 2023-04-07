import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ShopStarRatingComponent } from './list/shop-star-rating.component';
import { ShopStarRatingDetailComponent } from './detail/shop-star-rating-detail.component';
import { ShopStarRatingUpdateComponent } from './update/shop-star-rating-update.component';
import { ShopStarRatingDeleteDialogComponent } from './delete/shop-star-rating-delete-dialog.component';
import { ShopStarRatingRoutingModule } from './route/shop-star-rating-routing.module';

@NgModule({
  imports: [SharedModule, ShopStarRatingRoutingModule],
  declarations: [
    ShopStarRatingComponent,
    ShopStarRatingDetailComponent,
    ShopStarRatingUpdateComponent,
    ShopStarRatingDeleteDialogComponent,
  ],
})
export class ShopStarRatingModule {}
