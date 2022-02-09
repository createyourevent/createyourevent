import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ProductLikeDislikeComponent } from './list/product-like-dislike.component';
import { ProductLikeDislikeDetailComponent } from './detail/product-like-dislike-detail.component';
import { ProductLikeDislikeUpdateComponent } from './update/product-like-dislike-update.component';
import { ProductLikeDislikeDeleteDialogComponent } from './delete/product-like-dislike-delete-dialog.component';
import { ProductLikeDislikeRoutingModule } from './route/product-like-dislike-routing.module';

@NgModule({
  imports: [SharedModule, ProductLikeDislikeRoutingModule],
  declarations: [
    ProductLikeDislikeComponent,
    ProductLikeDislikeDetailComponent,
    ProductLikeDislikeUpdateComponent,
    ProductLikeDislikeDeleteDialogComponent,
  ],
  entryComponents: [ProductLikeDislikeDeleteDialogComponent],
})
export class ProductLikeDislikeModule {}
