import { NgModule } from '@angular/core';
import { SharedLibsModule } from './shared-libs.module';
import { FindLanguageFromKeyPipe } from './language/find-language-from-key.pipe';
import { TranslateDirective } from './language/translate.directive';
import { AlertComponent } from './alert/alert.component';
import { AlertErrorComponent } from './alert/alert-error.component';
import { HasAnyAuthorityDirective } from './auth/has-any-authority.directive';
import { DurationPipe } from './date/duration.pipe';
import { FormatMediumDatetimePipe } from './date/format-medium-datetime.pipe';
import { FormatMediumDatePipe } from './date/format-medium-date.pipe';
import { SortByDirective } from './sort/sort-by.directive';
import { SortDirective } from './sort/sort.directive';
import { ItemCountComponent } from './pagination/item-count.component';
import { RandomNumberPipe } from 'app/pipes/random-number.pipe';
import { SafeHtmlPipe } from 'app/pipes/safeHtml.pipe';
import { FilterPipe } from 'app/pipes/filter.pipe';
import { WebaddressPartnerPipe } from 'app/pipes/webaddress_partner.pipe';
import { CheckShopActivePipe } from 'app/pipes/checkShopActive.pipe';
import { CheckServiceActivePipe } from 'app/pipes/checkServiceActive.pipe';
import { TransactionIdPipe } from 'app/pipes/transactionId.pipe';
import { GradientDirective } from 'app/views/gradient-directive/gradient.directive';
import { TotalTicketsPipe } from 'app/pipes/totalTickets.pipe';
import { EventHasOrganizationPipe } from 'app/pipes/eventHasOrganization.pipe';


@NgModule({
  imports: [SharedLibsModule],
  declarations: [
    FindLanguageFromKeyPipe,
    TranslateDirective,
    AlertComponent,
    AlertErrorComponent,
    HasAnyAuthorityDirective,
    DurationPipe,
    FormatMediumDatetimePipe,
    FormatMediumDatePipe,
    SortByDirective,
    SortDirective,
    ItemCountComponent,
    RandomNumberPipe,
    SafeHtmlPipe,
    FilterPipe,
    WebaddressPartnerPipe,
    CheckShopActivePipe,
    CheckServiceActivePipe,
    TransactionIdPipe,
    GradientDirective,
    TotalTicketsPipe,
    EventHasOrganizationPipe
  ],
  exports: [
    SharedLibsModule,
    FindLanguageFromKeyPipe,
    TranslateDirective,
    AlertComponent,
    AlertErrorComponent,
    HasAnyAuthorityDirective,
    DurationPipe,
    FormatMediumDatetimePipe,
    FormatMediumDatePipe,
    SortByDirective,
    SortDirective,
    ItemCountComponent,
    RandomNumberPipe,
    SafeHtmlPipe,
    FilterPipe,
    WebaddressPartnerPipe,
    CheckShopActivePipe,
    CheckServiceActivePipe,
    TransactionIdPipe,
    GradientDirective,
    TotalTicketsPipe,
    EventHasOrganizationPipe
  ],
})
export class SharedModule {}
