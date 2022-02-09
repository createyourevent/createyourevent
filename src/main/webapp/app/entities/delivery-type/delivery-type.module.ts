import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { DeliveryTypeComponent } from './list/delivery-type.component';
import { DeliveryTypeDetailComponent } from './detail/delivery-type-detail.component';
import { DeliveryTypeUpdateComponent } from './update/delivery-type-update.component';
import { DeliveryTypeDeleteDialogComponent } from './delete/delivery-type-delete-dialog.component';
import { DeliveryTypeRoutingModule } from './route/delivery-type-routing.module';

@NgModule({
  imports: [SharedModule, DeliveryTypeRoutingModule],
  declarations: [DeliveryTypeComponent, DeliveryTypeDetailComponent, DeliveryTypeUpdateComponent, DeliveryTypeDeleteDialogComponent],
  entryComponents: [DeliveryTypeDeleteDialogComponent],
})
export class DeliveryTypeModule {}
