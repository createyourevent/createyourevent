import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ShopCommentComponent } from './list/shop-comment.component';
import { ShopCommentDetailComponent } from './detail/shop-comment-detail.component';
import { ShopCommentUpdateComponent } from './update/shop-comment-update.component';
import { ShopCommentDeleteDialogComponent } from './delete/shop-comment-delete-dialog.component';
import { ShopCommentRoutingModule } from './route/shop-comment-routing.module';

@NgModule({
  imports: [SharedModule, ShopCommentRoutingModule],
  declarations: [ShopCommentComponent, ShopCommentDetailComponent, ShopCommentUpdateComponent, ShopCommentDeleteDialogComponent],
})
export class ShopCommentModule {}
