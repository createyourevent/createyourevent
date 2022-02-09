import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { EventServiceMapOrderComponent } from './list/event-service-map-order.component';
import { EventServiceMapOrderDetailComponent } from './detail/event-service-map-order-detail.component';
import { EventServiceMapOrderUpdateComponent } from './update/event-service-map-order-update.component';
import { EventServiceMapOrderDeleteDialogComponent } from './delete/event-service-map-order-delete-dialog.component';
import { EventServiceMapOrderRoutingModule } from './route/event-service-map-order-routing.module';

@NgModule({
  imports: [SharedModule, EventServiceMapOrderRoutingModule],
  declarations: [
    EventServiceMapOrderComponent,
    EventServiceMapOrderDetailComponent,
    EventServiceMapOrderUpdateComponent,
    EventServiceMapOrderDeleteDialogComponent,
  ],
  entryComponents: [EventServiceMapOrderDeleteDialogComponent],
})
export class EventServiceMapOrderModule {}
