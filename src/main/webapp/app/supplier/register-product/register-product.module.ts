import { NgModule } from '@angular/core';
import { RegisterProductComponent } from './register-product.component';
import { RegisterProductRoute } from './register-product.route';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { AddProductComponent } from './add-product.component';
import { OverviewProductComponent } from './overview-product.component';
import { ShortenerPipe } from '../../pipes/shortener.pipe';
import { UpdateProductComponent } from './update-product.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { NgxCurrencyModule } from 'ngx-currency';
import { PriceTypeModule } from 'app/views/type-flags/price-type/price-type.module';
import { QuillModule } from 'ngx-quill';
import { TagInputModule } from 'ngx-chips';
import { ToastModule } from 'primeng/toast';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';

@NgModule({
  declarations: [RegisterProductComponent, AddProductComponent, OverviewProductComponent, ShortenerPipe, UpdateProductComponent],
  imports: [
    SharedModule,
    RouterModule.forChild(RegisterProductRoute),
    MatTabsModule,
    MatIconModule,
    MatCardModule,
    FlexLayoutModule,
    ScrollPanelModule,
    NgxCurrencyModule,
    PriceTypeModule,
    QuillModule.forRoot(),
    TagInputModule,
    ToastModule,
    CheckboxModule,
    InputTextModule,
    InputNumberModule
  ]
})
export class RegisterProductModule {}
