import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ServiceOfferComponent } from './list/service-offer.component';
import { ServiceOfferDetailComponent } from './detail/service-offer-detail.component';
import { ServiceOfferUpdateComponent } from './update/service-offer-update.component';
import { ServiceOfferDeleteDialogComponent } from './delete/service-offer-delete-dialog.component';
import { ServiceOfferRoutingModule } from './route/service-offer-routing.module';

@NgModule({
  imports: [SharedModule, ServiceOfferRoutingModule],
  declarations: [ServiceOfferComponent, ServiceOfferDetailComponent, ServiceOfferUpdateComponent, ServiceOfferDeleteDialogComponent],
})
export class ServiceOfferModule {}
