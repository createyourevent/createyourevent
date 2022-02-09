import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ServiceMapComponent } from './list/service-map.component';
import { ServiceMapDetailComponent } from './detail/service-map-detail.component';
import { ServiceMapUpdateComponent } from './update/service-map-update.component';
import { ServiceMapDeleteDialogComponent } from './delete/service-map-delete-dialog.component';
import { ServiceMapRoutingModule } from './route/service-map-routing.module';

@NgModule({
  imports: [SharedModule, ServiceMapRoutingModule],
  declarations: [ServiceMapComponent, ServiceMapDetailComponent, ServiceMapUpdateComponent, ServiceMapDeleteDialogComponent],
  entryComponents: [ServiceMapDeleteDialogComponent],
})
export class ServiceMapModule {}
