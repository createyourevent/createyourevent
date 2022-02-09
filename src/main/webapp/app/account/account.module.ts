import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { DropdownModule } from 'primeng/dropdown';
import { MatExpansionModule } from '@angular/material/expansion';
import { TabViewModule } from 'primeng/tabview';
import { CardModule } from 'primeng/card';
import { STRIPE_TEST } from 'app/constants';
import { NgxStripeModule } from 'ngx-stripe';
import { ToastModule } from 'primeng/toast';
import { MultiSelectModule } from 'primeng/multiselect';
import { SettingsModule } from './settings/settings.module';

@NgModule({
  imports: [SharedModule,
            GooglePlaceModule,
            DropdownModule,
            MatExpansionModule,
            TabViewModule,
            CardModule,
            NgxStripeModule.forRoot(STRIPE_TEST),
            ToastModule,
            MultiSelectModule,
          ],
  declarations: [
  ]
})
export class AccountModule {}
