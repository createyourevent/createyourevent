import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateOrganizationModule } from './create-organization/create-organization.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ViewOrganizationModule } from './view-organization/view-organization.module';
import { DashboardOrganizationComponent } from './admin-dashboard-organization/admin-dashboard-organization.component';
import { SharedModule } from 'app/shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TagCloudModule } from 'angular-tag-cloud-module';
import { ServiceMapSliderModule } from 'app/views/boxes/servicemap_slider/servicemap_slider.module';
import { CommentBoxModule } from 'app/views/comment-box/comment-box.module';
import { AdminLikeDislikeModule } from 'app/views/ratings/like_dislike/admin_like_dislike/admin_like_dislike.module';
import { LikeDislikeModule } from 'app/views/ratings/like_dislike/like_dislike.module';
import { StarRatingModule } from 'app/views/ratings/starRating/starRating.module';
import { TagInputModule } from 'ngx-chips';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { QuillModule } from 'ngx-quill';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { GalleriaModule } from 'primeng/galleria';
import { GMapModule } from 'primeng/gmap';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { AdminDashboardOrganizationRoutes } from './admin-dashboard-organization/admin-dashboard-organization.routing';
import { FileUploadModule } from 'primeng/fileupload';
import { AdminGalleryOrganizationComponent } from './admin-gallery-organization/admin-gallery-organization.component';
import { GalleryOrganizationeComponent } from './gallery-organization/gallery-organization.component';
import { ViewClubComponent } from './view-organization/club/view-club.component';
import { ViewHotelComponent } from './view-organization/hotel/view-hotel.component';
import { ViewRestaurantComponent } from './view-organization/restaurant/view-restaurant.component';
import { RentModule } from './rent/rent.module';
import { EditOrganizationModule } from './edit-organization/edit-organization.module';
import { OrganizationHasEventsModule } from 'app/views/organization-has-events/organization-has-events.module';

@NgModule({
  imports: [
    EditOrganizationModule,
    CommonModule,
    CreateOrganizationModule,
    DashboardModule,
    ViewOrganizationModule,
    SharedModule,
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
    AdminDashboardOrganizationRoutes,
    RentModule,
    OrganizationHasEventsModule
  ],
  declarations: [DashboardOrganizationComponent, AdminGalleryOrganizationComponent, GalleryOrganizationeComponent, ViewRestaurantComponent, ViewHotelComponent, ViewClubComponent],
  exports: [AdminGalleryOrganizationComponent, GalleryOrganizationeComponent]
})
export class OrganizationModule { }
