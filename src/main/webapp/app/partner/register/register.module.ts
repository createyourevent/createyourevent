import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterRoutes } from './register.routing';
import { SharedModule } from 'app/shared/shared.module';
import { RegisterComponent } from './register.component';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';

@NgModule({
  imports: [CommonModule, RegisterRoutes, SharedModule, GooglePlaceModule],
  declarations: [RegisterComponent]
})
export class RegisterModule {}
