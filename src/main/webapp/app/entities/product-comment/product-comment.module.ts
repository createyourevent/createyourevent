import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ProductCommentComponent } from './list/product-comment.component';
import { ProductCommentDetailComponent } from './detail/product-comment-detail.component';
import { ProductCommentUpdateComponent } from './update/product-comment-update.component';
import { ProductCommentDeleteDialogComponent } from './delete/product-comment-delete-dialog.component';
import { ProductCommentRoutingModule } from './route/product-comment-routing.module';

@NgModule({
  imports: [SharedModule, ProductCommentRoutingModule],
  declarations: [
    ProductCommentComponent,
    ProductCommentDetailComponent,
    ProductCommentUpdateComponent,
    ProductCommentDeleteDialogComponent,
  ],
  entryComponents: [ProductCommentDeleteDialogComponent],
})
export class ProductCommentModule {}
