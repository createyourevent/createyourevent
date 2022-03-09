import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { QuillModule } from 'ngx-quill';
import { EditOrganizationComponent } from './edit-organization.component';
import { EDIT_ORGANIZATION_ROUTE } from './edit-organization.route';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  imports: [CommonModule, SharedModule, RouterModule.forChild(EDIT_ORGANIZATION_ROUTE), GooglePlaceModule, QuillModule, MatCheckboxModule],
  declarations: [EditOrganizationComponent],
})
export class EditOrganizationModule {}
