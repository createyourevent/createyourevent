import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';

import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { TagCloudModule } from 'angular-tag-cloud-module';
import { MatTabsModule } from '@angular/material/tabs';
import { FileUploadModule } from 'primeng/fileupload';
import { GalleriaModule } from 'primeng/galleria';
import { shopRoute } from './shop.route';
import { DashboardSupplierShopComponent } from './admin-dashboard-supplier-shop/admin-dashboard-supplier-shop.component';
import { AdminGalleryShopComponent } from './admin-gallery-shop/admin-gallery-shop.component';
import { GalleryShopComponent } from './gallery-shop/gallery-shop.component';
import { CommentBoxModule } from '../comment-box/comment-box.module';
import { LikeDislikeModule } from '../ratings/like_dislike/like_dislike.module';
import { AdminLikeDislikeModule } from '../ratings/like_dislike/admin_like_dislike/admin_like_dislike.module';
import { AdminCalculationShopComponent } from './admin-calculation-shop/admin-calculation-shop.component';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputSwitchModule } from 'primeng/inputswitch';
import { AdminReservationsShopComponent } from './admin-reservations-shop/admin-reservations-shop.component';
import { StarRatingModule } from '../ratings/starRating/starRating.module';
import { Mp3PlayerAdminModule } from '../mp3-player/mp3-player-admin/mp3-player-admin.module';


@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(shopRoute),
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
    ButtonModule,
    InputSwitchModule,
    StarRatingModule,
    Mp3PlayerAdminModule
  ],
  declarations: [DashboardSupplierShopComponent, AdminGalleryShopComponent, GalleryShopComponent, AdminCalculationShopComponent, AdminReservationsShopComponent],
  entryComponents: [],
  exports: [GalleryShopComponent, AdminCalculationShopComponent]
})
export class CreateyoureventShopsModule {}
