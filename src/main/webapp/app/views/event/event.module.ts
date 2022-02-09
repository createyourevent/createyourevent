import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AccordionModule } from 'primeng/accordion';
import { SharedModule } from 'app/shared/shared.module';
import { EventDetailComponent } from './event-detail.component';
import { EventUpdateComponent } from './event-update.component';
import { EventDeleteDialogComponent } from './event-delete-dialog.component';
import { eventRoute } from './event.route';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { EventToProductRatingComponent } from './evaluate/evaluate-event-product.component';
import { EditLocationUpdateComponent } from './location-update.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { AddressUpdateComponent } from './address-update.component';
import { EditProductsComponent } from './edit-products.component';
import { ReservationCounterModule } from '../reservation-counter/reservation-counter.module';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { MatTabsModule } from '@angular/material/tabs';
import { AdminCommentsEventProductComponent } from './admin-comments/admin-comments-event-product.component';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { MatListModule } from '@angular/material/list';
import { FlexLayoutModule } from '@angular/flex-layout';
import { GalleryEventComponent } from './gallery-event/gallery-event.component';
import { GalleriaModule } from 'primeng/galleria';
import { FileUploadModule } from 'primeng/fileupload';
import { WorkflowOrganisatorModule } from './workflow-organisator/workflow-organisator.module';
import { CommentBoxModule } from '../comment-box/comment-box.module';
import { LikeDislikeModule } from '../ratings/like_dislike/like_dislike.module';
import { AdminLikeDislikeModule } from '../ratings/like_dislike/admin_like_dislike/admin_like_dislike.module';
import { PriceTypeModule } from '../type-flags/price-type/price-type.module';
import { SliderModule } from 'primeng/slider';
import { QuillModule } from 'ngx-quill';
import { TableModule } from 'primeng/table';
import { AdminCommentsEventComponent } from './admin-comments/admin-comments-event.component';
import { AdminGalleryEventComponent } from './admin-gallery-event/admin-gallery-event.component';
import { CalculationEventComponent } from './calculation-event/calculation-event.component';
import { DashboardEventComponent } from './dashboard-event/dashboard-event.component';
import { CalculationComponent } from './dashboard-event/calculation/calculation.component';
import { CommentsComponent } from './dashboard-event/comments/comments.component';
import { GalleryComponent } from './dashboard-event/gallery/gallery.component';
import { RatingsComponent } from './dashboard-event/ratings/ratings.component';
import { WorkflowComponent } from './dashboard-event/workflow/workflow.component';
import { CountdownTimerModule } from 'app/countdown/countdown.module';
import { AllParticipantsModule } from './all-participants/all-participants.module';
import { StarRatingsComponent } from './dashboard-event/star-ratings/star-ratings.component';
import { OrderListModule } from 'primeng/orderlist';
import { MatExpansionModule } from '@angular/material/expansion';
import { TagInputModule } from 'ngx-chips';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { EventProductOrderDeleteDialogComponent } from './event-product-order-delete-dialog.component';
import { AddProductComponent } from './add-product.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { EditServicesComponent } from './edit-services.component';
import { ShareModule } from 'ngx-sharebuttons';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { GMapModule } from 'primeng/gmap';
import { CrossSellingEventsModule } from './crossSellingEvents/crossSellingEvents.module';
import { NgxCurrencyModule } from "ngx-currency";
import { Mp3PlayerModule } from '../mp3-player/mp3-player.module';
import { MP3Component } from './dashboard-event/mp3/mp3.component';
import { Mp3PlayerAdminModule } from '../mp3-player/mp3-player-admin/mp3-player-admin.module';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { PaymentModule } from '../payment/payment.module';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { EventPaymentDialogComponent } from './event-payment-dialog.component';
import { InFavoritsComponent } from './dashboard-event/in-favorits/in-favorits.component';
import { PickListModule } from 'primeng/picklist';
import { TillModule } from '../till/till.module';
import { KnobModule } from 'primeng/knob';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { ProgressBarModule } from 'primeng/progressbar';

@NgModule({
  imports: [
    DropdownModule,
    PickListModule,
    NgxMaterialTimepickerModule,
    SharedModule,
    CommonModule,
    RouterModule.forChild(eventRoute),
    MatCardModule,
    MatToolbarModule,
    NgbModule,
    MatButtonModule,
    TillModule,
    MatIconModule,
    GooglePlaceModule,
    ReservationCounterModule,
    YouTubePlayerModule,
    MatTabsModule,
    AccordionModule,
    ScrollPanelModule,
    MatListModule,
    FlexLayoutModule,
    GalleriaModule,
    FileUploadModule,
    WorkflowOrganisatorModule,
    CommentBoxModule,
    LikeDislikeModule,
    AdminLikeDislikeModule,
    PriceTypeModule,
    SliderModule,
    QuillModule.forRoot(),
    TableModule,
    CountdownTimerModule,
    AllParticipantsModule,
    OrderListModule,
    MatExpansionModule,
    TagInputModule,
    ProgressSpinnerModule,
    InputNumberModule,
    ToastModule,
    ShareModule,
    ShareButtonsModule,
    ShareIconsModule,
    GMapModule,
    CrossSellingEventsModule,
    NgxCurrencyModule,
    ReactiveFormsModule,
    Mp3PlayerModule,
    Mp3PlayerAdminModule,
    NgxQRCodeModule,
    DynamicDialogModule,
    PaymentModule,
    KnobModule,
    DialogModule,
    ProgressBarModule
  ],
  declarations: [
    StarRatingsComponent,
    AddProductComponent,
    EventDetailComponent,
    EventUpdateComponent,
    EventDeleteDialogComponent,
    EventToProductRatingComponent,
    EditLocationUpdateComponent,
    AddressUpdateComponent,
    EditProductsComponent,
    GalleryEventComponent,
    CalculationEventComponent,
    DashboardEventComponent,
    AdminCommentsEventComponent,
    AdminCommentsEventProductComponent,
    AdminGalleryEventComponent,
    CalculationComponent,
    CommentsComponent,
    GalleryComponent,
    RatingsComponent,
    WorkflowComponent,
    EventProductOrderDeleteDialogComponent,
    EditServicesComponent,
    MP3Component,
    EventPaymentDialogComponent,
    InFavoritsComponent
  ],
  entryComponents: [EventDeleteDialogComponent, AdminCommentsEventProductComponent, EventProductOrderDeleteDialogComponent, EventPaymentDialogComponent],
  exports: [
    GalleryEventComponent,
    CalculationEventComponent,
    DashboardEventComponent,
    AdminCommentsEventComponent,
    AdminCommentsEventProductComponent,
    AdminGalleryEventComponent,
    MP3Component
  ]
})
export class CYEEventModule {}
