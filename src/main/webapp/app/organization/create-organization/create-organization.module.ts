import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateOrganizationComponent } from './create-organization.component';
import { SharedModule } from 'app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { CREATE_ORGANIZATION_ROUTE } from './create-organization.route';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { QuillModule } from 'ngx-quill';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(CREATE_ORGANIZATION_ROUTE),
    GooglePlaceModule,
    QuillModule
  ],
  declarations: [CreateOrganizationComponent]
})
export class CreateOrganizationModule { }
