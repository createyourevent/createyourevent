import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CreateYourEventServiceComponent } from './list/create-your-event-service.component';
import { CreateYourEventServiceDetailComponent } from './detail/create-your-event-service-detail.component';
import { CreateYourEventServiceUpdateComponent } from './update/create-your-event-service-update.component';
import { CreateYourEventServiceDeleteDialogComponent } from './delete/create-your-event-service-delete-dialog.component';
import { CreateYourEventServiceRoutingModule } from './route/create-your-event-service-routing.module';

@NgModule({
  imports: [SharedModule, CreateYourEventServiceRoutingModule],
  declarations: [
    CreateYourEventServiceComponent,
    CreateYourEventServiceDetailComponent,
    CreateYourEventServiceUpdateComponent,
    CreateYourEventServiceDeleteDialogComponent,
  ],
  entryComponents: [CreateYourEventServiceDeleteDialogComponent],
})
export class CreateYourEventServiceModule {}
