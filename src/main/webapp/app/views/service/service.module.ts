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
import { CommentBoxModule } from '../comment-box/comment-box.module';
import { LikeDislikeModule } from '../ratings/like_dislike/like_dislike.module';
import { AdminLikeDislikeModule } from '../ratings/like_dislike/admin_like_dislike/admin_like_dislike.module';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputSwitchModule } from 'primeng/inputswitch';
import { serviceRoute } from './service.route';
import { DashboardServiceComponent } from './admin-dashboard-service/admin-dashboard-service.component';
import { AdminGalleryServiceComponent } from './admin-gallery-service/admin-gallery-service.component';
import { GalleryServiceComponent } from './gallery-service/gallery-service.component';
import { CreateYourEventServiceUpdateComponent } from './create-your-event-service-update.component';
import { CreateYourEventServiceDetailComponent } from './create-your-event-service-detail.component';
import { QuillModule } from 'ngx-quill';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { ServiceMapSliderModule } from '../boxes/servicemap_slider/servicemap_slider.module';
import { TagInputModule } from 'ngx-chips';
import { StarRatingModule } from '../ratings/starRating/starRating.module';
import { GMapModule } from 'primeng/gmap';
import { ToastModule } from 'primeng/toast';
import { Mp3PlayerAdminModule } from '../mp3-player/mp3-player-admin/mp3-player-admin.module';
import { Mp3PlayerModule } from '../mp3-player/mp3-player.module';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(serviceRoute),
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
    QuillModule.forRoot(),
    GooglePlaceModule,
    ServiceMapSliderModule,
    TagInputModule,
    StarRatingModule,
    GMapModule,
    ToastModule,
    Mp3PlayerAdminModule,
    Mp3PlayerModule
  ],
  declarations: [
    DashboardServiceComponent,
    AdminGalleryServiceComponent,
    GalleryServiceComponent,
    CreateYourEventServiceUpdateComponent,
    CreateYourEventServiceDetailComponent
  ],
  entryComponents: [],
  exports: [GalleryServiceComponent]
})
export class CreateyoureventServicessModule {}
