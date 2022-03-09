import { PrintBondModule } from './admin/admin-bonds/print-bond/print-bond.module';
import { NgModule, LOCALE_ID, DEFAULT_CURRENCY_CODE } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import locale from '@angular/common/locales/en';
import { BrowserModule, Title } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { TranslateModule, TranslateService, TranslateLoader, MissingTranslationHandler } from '@ngx-translate/core';
import { NgxWebstorageModule } from 'ngx-webstorage';
import * as dayjs from 'dayjs';
import { NgbDateAdapter, NgbDatepickerConfig, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SERVER_API_URL } from './app.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import './config/dayjs';
import { SharedModule } from 'app/shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { CreateyoureventHomeModule } from './home/home.module';
import { EntityRoutingModule } from './entities/entity-routing.module';
// jhipster-needle-angular-add-module-import JHipster will add new module here
import { NgbDateDayjsAdapter } from './config/datepicker-adapter';
import { fontAwesomeIcons } from './config/font-awesome-icons';
import { httpInterceptorProviders } from 'app/core/interceptor/index';
import { translatePartialLoader, missingTranslationHandler } from './config/translation.config';
import { MainComponent } from './layouts/main/main.component';
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { PageRibbonComponent } from './layouts/profiles/page-ribbon.component';
import { ActiveMenuDirective } from './layouts/navbar/active-menu.directive';
import { ErrorComponent } from './layouts/error/error.component';
import { ScullyLibModule } from '@scullyio/ng-lib';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { HttpModule } from '@angular/http';
import { MatListModule } from '@angular/material/list';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/moment';
import { NgChatModule } from 'ng-chat';
import { FacebookModule } from 'ngx-facebook';
import { MatomoModule } from 'ngx-matomo';
import { ShareModule } from 'ngx-sharebuttons';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { ToastModule } from 'primeng/toast';
import { CartModule } from './cart/cart.module';
import { ChatNotificationComponent } from './chat/chat-notification/chat-notification.component';
import { ChatModule } from './chat/chat.module';
import { FormlyFieldAddressAppModule } from './formly/formly-field-address.module';
import { FormlyFieldDateTimeAppModule } from './formly/formly-field-date.module';
import { FormlyFieldEditorAppModule } from './formly/formly-field-editor.module';
import { FormlyFieldKeywordsAppModule } from './formly/formly-field-keywords.module';
import { FormlyFieldTimeAppModule } from './formly/formly-field-time.module';
import { PointsDisplayComponent } from './points/points-display/points-display.component';
import { SchaffhausenHomeModule } from './schaffhausen/schaffhausenHome/schaffhausenHome.module';
import { StreamModule } from './stream/stream.module';
import { SystemNotificationComponent } from './system-notification/system-notification.component';
import { EventSliderModule } from './views/boxes/event_slider/event_slider.module';
import { MovieSliderModule } from './views/boxes/movie_slider/movie_slider.module';
import { PartnerAdsSliderModule } from './views/boxes/partner_ads_slider/partner_ads_slider.module';
import { PartnerSliderModule } from './views/boxes/partner_slider/partner_slider.module';
import { EventTickerModule } from './views/event-ticker/event-ticker.module';
import { ChipHolderComponent } from './views/games/find-the-chips/chip/chip-holder.component';
import { ChipComponent } from './views/games/find-the-chips/chip/chip.component';
import { ChipHolderDirective } from './views/games/find-the-chips/chip/chip.directive';
import { CYETagCloudModule } from './views/tag-cloud/tag-cloud.module';
import { TickerModule } from './views/ticker/ticker.module';
import { CreateyoureventViewsModule } from './views/views.module';
import { GoogleMapsModule } from '@angular/google-maps';
import { NotifierModule } from 'angular-notifier';
import { FlatpickrModule } from 'angularx-flatpickr';
import { NgxScrollTopModule } from 'ngx-scrolltop';
import { StickyNavModule } from 'ng2-sticky-nav';
import { BillingModule } from './account/billing/billing.module';
import { AdminFeesModule } from './admin/billing-tools/admin_fees/admin_fees.module';
import { OrganisatorBillingModule } from './admin/billing-tools/organisator/organisator_billing.module';
import { ServiceBillingModule } from './admin/billing-tools/service/service_billing.module';
import { SupplierBillingModule } from './admin/billing-tools/supplier/suppllier_billing.module';
import { CreateyoureventShopsModule } from './views/shop/shop.module';
import { FieldQuillType } from './formly/quill.type';
import { QuillModule } from 'ngx-quill';
import { CreateyoureventCYEChipsModule } from './views/games/find-the-chips/admin-chips/chips.module';
import { SettingsModule } from './account/settings/settings.module';
import localeDECH from '@angular/common/locales/de-CH';
import { AdsenseModule } from 'ng2-adsense';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { MomentModule } from 'angular2-moment';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PaymentModule } from './views/payment/payment.module';
import { ReservedEventsComponent } from './views/reserved-events/reserved-events.component';
import { MatCardModule } from '@angular/material/card';
import { DockerAppsModule } from './views/docker-apps/docker-apps.module';
import { BuyTicketModule } from './views/buy-ticket/buy-ticket.module';
import { OurRangeModule } from './views/our-range/our-range.module';
import { VideoplayerModule } from './views/videoplayer/videoplayer.module';
import { OrganizationModule } from './organization/organization.module';
import { OrganizationHasEventsModule } from './views/organization-has-events/organization-has-events.module';
import { AdminCouponsModule } from './admin/admin-coupons/admin-coupons.module';

registerLocaleData(localeDECH);

@NgModule({
  imports: [
    OrganizationHasEventsModule,
    OrganizationModule,
    VideoplayerModule,
    OurRangeModule,
    DockerAppsModule,
    MatCardModule,
    PaymentModule,
    ModalModule.forRoot(),
    NgIdleKeepaliveModule.forRoot(),
    MomentModule,
    PrintBondModule,
    BillingModule,
    SettingsModule,
    CreateyoureventCYEChipsModule,
    CreateyoureventShopsModule,
    BrowserModule,
    SharedModule,
    CreateyoureventHomeModule,
    // jhipster-needle-angular-add-module JHipster will add new module here
    EntityRoutingModule,
    AppRoutingModule,
    // Set this to true to enable service worker (PWA)
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: false }),
    HttpClientModule,
    NgxWebstorageModule.forRoot({ prefix: 'jhi', separator: '-', caseSensitive: true }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: translatePartialLoader,
        deps: [HttpClient],
      },
      missingTranslationHandler: {
        provide: MissingTranslationHandler,
        useFactory: missingTranslationHandler,
      },
    }),
    ScullyLibModule,
    ReactiveFormsModule,
    FormlyModule.forRoot({
      validationMessages: [{ name: 'required', message: 'This field is required' }],
      types: [
        {
          name: 'quill',
          component: FieldQuillType,
          wrappers: ['form-field'],
        },
      ],
    }),
    FormlyBootstrapModule,
    BuyTicketModule,
    EventSliderModule,
    MovieSliderModule,
    PartnerSliderModule,
    NgxScrollTopModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    CreateyoureventHomeModule,
    CartModule,
    CYETagCloudModule,
    StreamModule,
    OrganisatorBillingModule,
    ServiceBillingModule,
    SupplierBillingModule,
    AdminFeesModule,
    // jhipster-needle-angular-add-module JHipster will add new module here
    CreateyoureventViewsModule,
    NgbModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    GoogleMapsModule,
    FormlyFieldTimeAppModule,
    FormlyFieldAddressAppModule,
    FormlyFieldDateTimeAppModule,
    FormlyFieldEditorAppModule,
    FormlyFieldKeywordsAppModule,
    HttpModule,
    NgChatModule,
    ChatModule,
    FacebookModule.forRoot(),
    ToastModule,
    MatListModule,
    ShareModule,
    ShareButtonsModule,
    ShareIconsModule,
    StickyNavModule,
    TickerModule,
    EventTickerModule,
    MatomoModule,
    NotifierModule,
    SchaffhausenHomeModule,
    PartnerAdsSliderModule,
    QuillModule.forRoot(),
    AdsenseModule.forRoot({
      adClient: 'ca-pub-4410151524668264',
      adSlot: 3176148201,
    }),
  ],
  providers: [
    Title,
    { provide: LOCALE_ID, useValue: 'de-CH' },
    { provide: NgbDateAdapter, useClass: NgbDateDayjsAdapter },
    httpInterceptorProviders,
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'CHF' },
  ],
  declarations: [
    MainComponent,
    NavbarComponent,
    ErrorComponent,
    PageRibbonComponent,
    ActiveMenuDirective,
    FooterComponent,
    ChatNotificationComponent,
    SystemNotificationComponent,
    ReservedEventsComponent,
    PointsDisplayComponent,
    ChipHolderComponent,
    ChipHolderDirective,
    ChipComponent,
    FieldQuillType,
  ],
  bootstrap: [MainComponent],
})
export class AppModule {
  constructor(
    applicationConfigService: ApplicationConfigService,
    iconLibrary: FaIconLibrary,
    dpConfig: NgbDatepickerConfig,
    translateService: TranslateService
  ) {
    applicationConfigService.setEndpointPrefix(SERVER_API_URL);
    registerLocaleData(locale);
    iconLibrary.addIcons(...fontAwesomeIcons);
    dpConfig.minDate = { year: dayjs().subtract(100, 'year').year(), month: 1, day: 1 };
    translateService.setDefaultLang('en');
    translateService.use('en');
  }
}
