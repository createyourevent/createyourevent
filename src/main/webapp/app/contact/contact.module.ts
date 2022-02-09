import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GoogleMapsModule } from '@angular/google-maps';
import { ContactComponent } from './contact.component';
import { MatTabsModule } from '@angular/material/tabs';
import { SharedModule } from 'app/shared/shared.module';
import { GMapModule } from 'primeng/gmap';
import { ContactRoutes } from './contact.routing';



@NgModule({
  declarations: [ContactComponent],
  imports: [CommonModule, ContactRoutes, GoogleMapsModule, MatTabsModule, SharedModule, GMapModule]
})
export class ContactModule {}
