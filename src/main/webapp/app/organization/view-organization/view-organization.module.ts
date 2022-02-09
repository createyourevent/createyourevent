import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'app/shared/shared.module';
import { ViewOrganizationRoutes } from './view-organization.routing';
import { ViewRestaurantComponent } from './restaurant/view-restaurant.component';
import { MatTabsModule } from '@angular/material/tabs';
import { CommentBoxModule } from 'app/views/comment-box/comment-box.module';
import { LikeDislikeModule } from 'app/views/ratings/like_dislike/like_dislike.module';
import { StarRatingModule } from 'app/views/ratings/starRating/starRating.module';
import { TagInputModule } from 'ngx-chips';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { QuillModule } from 'ngx-quill';
import { GMapModule } from 'primeng/gmap';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { ViewClubComponent } from './club/view-club.component';
import { ViewHotelComponent } from './hotel/view-hotel.component';
import { OrganizationHasEventsModule } from 'app/views/organization-has-events/organization-has-events.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MatTabsModule,
    LikeDislikeModule,
    CommentBoxModule,
    GooglePlaceModule,
    QuillModule,
    TagInputModule,
    StarRatingModule,
    GMapModule,
    ProgressSpinnerModule,
    ToastModule,
    ViewOrganizationRoutes
  ],
  declarations: []
})
export class ViewOrganizationModule { }
