import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CouponsComponent } from './coupons.component';
import { SharedModule } from 'app/shared/shared.module';
import { CouponsRoutes } from './coupons.routing';

import { DataViewModule } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { CardModule } from 'primeng/card';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CouponsRoutes,
    DataViewModule,
    PanelModule,
    DialogModule,
    DropdownModule,
    InputTextModule,
    ButtonModule,
    RippleModule,
    RatingModule,
    CardModule,
    NgxQRCodeModule,
  ],
  declarations: [CouponsComponent],
})
export class CouponsModule {}
