import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { CreateServiceComponent } from './create-service.component';
import { CREATE_SERVICE_ROUTE } from './create-service.route';
import { QuillModule } from 'ngx-quill';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { TagInputModule } from 'ngx-chips';
import { ToastModule } from 'primeng/toast';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([CREATE_SERVICE_ROUTE]),
    QuillModule.forRoot(),
    GooglePlaceModule,
    TagInputModule,
    ToastModule
  ],

  declarations: [CreateServiceComponent]
})
export class CreateServiceModule {}
