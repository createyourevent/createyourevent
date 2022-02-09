import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { ServiceMapsComponent } from './service-maps.component';
import { SERVICE_MAPS_ROUTE } from './service-maps.route';
import { NewServiceMapsComponent } from './new-service-maps.component';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { AddRideCostsComponent } from './add-ride-costs.component';
import { DropdownModule } from 'primeng/dropdown';
import { ServiceOffersComponent } from './service-offers.component';
import { ServiceMapDeleteDialogComponent } from './service-map-delete-dialog.component';

@NgModule({
  imports: [SharedModule,
    RouterModule.forChild(SERVICE_MAPS_ROUTE),
    InputTextareaModule,
    TableModule,
    ButtonModule,
    ToolbarModule,
    DialogModule,
    DropdownModule],
  declarations: [ServiceMapsComponent, NewServiceMapsComponent, AddRideCostsComponent, ServiceOffersComponent, ServiceMapDeleteDialogComponent]
})
export class ServiceMapsModule {}
