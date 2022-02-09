import { NgModule } from '@angular/core';
import { CreateEventRoute } from './create-event.route';
import { RouterModule } from '@angular/router';
import { CreateEventComponent } from './create-event.component';
import { FormatTitlePipe } from '../../pipes/format-title.pipe';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormlyFieldTimeComponent } from 'app/formly/formly-field-time.component';
import { OverviewComponent } from './overview.component';
import { SharedModule } from 'app/shared/shared.module';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FormlyFieldAddressComponent } from 'app/formly/formly-field-address.component';
import { FlyerComponent } from './flyer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SelectProductsComponent } from './select-products.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { SliderModule } from 'primeng/slider';
import { FormlyFieldEditorComponent } from 'app/formly/formly-field-editor.component';
import { PriceTypeModule } from 'app/views/type-flags/price-type/price-type.module';
import { ToastModule } from 'primeng/toast';
import { FormlyFieldDateComponent } from 'app/formly/formly-field-date.component';
import { SelectServicesComponent } from './select-services.component';
import { TillModule } from 'app/views/till/till.module';
import { FormlyFieldKeywordsComponent } from 'app/formly/formly-field-keywords.component';
import { DropdownModule } from 'primeng/dropdown';
import { KnobModule } from 'primeng/knob';
import { ProductsServicesComponent } from './products-services/products-services.component';
import { ListboxModule } from 'primeng/listbox';
import { FieldQuillType } from 'app/formly/quill.type';
import { FormlyFieldRadio } from 'app/formly/formly-field-radio.type';
import { NgxCurrencyModule } from "ngx-currency";
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { RentCalendarComponent } from './rent-calendar.component';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CardModule } from 'primeng/card';
import { DataViewModule } from 'primeng/dataview';
import { InputTextModule } from 'primeng/inputtext';
import { OrganizationReservationCalendarModule } from './organization-reservation-calendar/organization-reservation-calendar.module';
import { ButtonModule } from 'primeng/button';

@NgModule({
  declarations: [
    CreateEventComponent,
    FormatTitlePipe,
    OverviewComponent,
    FlyerComponent,
    SelectProductsComponent,
    SelectServicesComponent,
    ProductsServicesComponent,
    FormlyFieldRadio,
    RentCalendarComponent
  ],
  imports: [
    ButtonModule,
    OrganizationReservationCalendarModule,
    InputTextModule,
    DataViewModule,
    CardModule,
    RadioButtonModule,
    DynamicDialogModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    CommonModule,
    RouterModule.forChild(CreateEventRoute),
    MatStepperModule,
    MatTabsModule,
    MatIconModule,
    MatCardModule,
    MatCheckboxModule,
    MatTableModule,
    MatToolbarModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    FormlyBootstrapModule,
    FormlyModule.forRoot({
      validationMessages: [{ name: 'not4weeks', message: 'The date must be at least 4 weeks in the future.' }],
      types: [
        { name: 'time', component: FormlyFieldTimeComponent },
        { name: 'address', component: FormlyFieldAddressComponent },
        { name: 'date', component: FormlyFieldDateComponent },
        { name: 'editor', component: FormlyFieldEditorComponent },
        { name: 'quill', component: FieldQuillType },
        { name: 'keywords', component: FormlyFieldKeywordsComponent },
        { name: 'cye', component: FormlyFieldRadio },
      ]
    }),
    YouTubePlayerModule,
    FlexLayoutModule,
    ScrollPanelModule,
    SliderModule,
    PriceTypeModule,
    ToastModule,
    TillModule,
    DropdownModule,
    KnobModule,
    ListboxModule,
    NgxCurrencyModule
  ]
})
export class CreateEventModule {}
