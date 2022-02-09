import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterShopComponent } from './register-shop.component';
import { RegisterShopRoute } from './register-shop.route';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'app/shared/shared.module';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { QuillModule } from 'ngx-quill';
import { TagInputModule } from 'ngx-chips';
import { ValidateFileSizeService } from 'app/validators/ValidateFileSize.service';
import { ToastModule } from 'primeng/toast';

@NgModule({
  declarations: [RegisterShopComponent],
  imports: [
    SharedModule,
    CommonModule,
    RouterModule.forChild(RegisterShopRoute),
    FormsModule,
    ReactiveFormsModule,
    GooglePlaceModule,
    QuillModule.forRoot(),
    TagInputModule,
    ToastModule
  ],
  providers: [ValidateFileSizeService]
})
export class RegisterShopModule {}
