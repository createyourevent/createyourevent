import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { ProductDetailComponent } from './product-detail.component';
import { productRoute } from './product.route';

import { ProductDeleteDialogComponent } from './product-delete-dialog.component';
import { ProductUpdateComponent } from './product-update.component';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { TagCloudModule } from 'angular-tag-cloud-module';
import { MatTabsModule } from '@angular/material/tabs';
import { DashboardSupplierComponent } from './admin-dashboard-supplier/admin-dashboard-supplier.component';
import { AdminGalleryProductComponent } from './admin-gallery-product/admin-gallery-product.component';
import { FileUploadModule } from 'primeng/fileupload';
import { GalleryProductComponent } from './gallery-product/gallery-product.component';
import { GalleriaModule } from 'primeng/galleria';
import { CommentBoxModule } from 'app/views/comment-box/comment-box.module';
import { LikeDislikeModule } from 'app/views/ratings/like_dislike/like_dislike.module';
import { AdminLikeDislikeModule } from '../ratings/like_dislike/admin_like_dislike/admin_like_dislike.module';
import { AdminCalculationProductComponent } from './admin-calculation/admin-calculation-product.component';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { PriceTypeModule } from '../type-flags/price-type/price-type.module';
import { QuillModule } from 'ngx-quill';
import { TagInputModule } from 'ngx-chips';
import { StarRatingModule } from '../ratings/starRating/starRating.module';
import { ToastModule } from 'primeng/toast';
import { CrossSellingModule } from './crossSelling/crossSelling.module';
import { Mp3PlayerAdminModule } from '../mp3-player/mp3-player-admin/mp3-player-admin.module';
import { Mp3PlayerModule } from '../mp3-player/mp3-player.module';
import { AddProductToEventModule } from './add-product-to-event/add-product-to-event.module';

@NgModule({
  imports: [
    AddProductToEventModule,
    SharedModule,
    RouterModule.forChild(productRoute),
    MatCardModule,
    MatToolbarModule,
    NgbModule,
    YouTubePlayerModule,
    TagCloudModule,
    MatTabsModule,
    FileUploadModule,
    GalleriaModule,
    CommentBoxModule,
    LikeDislikeModule,
    AdminLikeDislikeModule,
    CardModule,
    TableModule,
    PriceTypeModule,
    QuillModule,
    TagInputModule,
    StarRatingModule,
    ToastModule,
    CrossSellingModule,
    Mp3PlayerAdminModule,
    Mp3PlayerModule,
  ],
  declarations: [
    ProductDetailComponent,
    ProductDeleteDialogComponent,
    ProductUpdateComponent,
    DashboardSupplierComponent,
    AdminGalleryProductComponent,
    GalleryProductComponent,
    AdminCalculationProductComponent,
  ],
  exports: [AdminGalleryProductComponent, AdminCalculationProductComponent],
})
export class CreateyoureventProductsModule {}
