import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ShopLikeDislikeComponent } from './list/shop-like-dislike.component';
import { ShopLikeDislikeDetailComponent } from './detail/shop-like-dislike-detail.component';
import { ShopLikeDislikeUpdateComponent } from './update/shop-like-dislike-update.component';
import { ShopLikeDislikeDeleteDialogComponent } from './delete/shop-like-dislike-delete-dialog.component';
import { ShopLikeDislikeRoutingModule } from './route/shop-like-dislike-routing.module';

@NgModule({
  imports: [SharedModule, ShopLikeDislikeRoutingModule],
  declarations: [
    ShopLikeDislikeComponent,
    ShopLikeDislikeDetailComponent,
    ShopLikeDislikeUpdateComponent,
    ShopLikeDislikeDeleteDialogComponent,
  ],
})
export class ShopLikeDislikeModule {}
