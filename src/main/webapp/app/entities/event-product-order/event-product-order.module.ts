import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { EventProductOrderComponent } from './list/event-product-order.component';
import { EventProductOrderDetailComponent } from './detail/event-product-order-detail.component';
import { EventProductOrderUpdateComponent } from './update/event-product-order-update.component';
import { EventProductOrderDeleteDialogComponent } from './delete/event-product-order-delete-dialog.component';
import { EventProductOrderRoutingModule } from './route/event-product-order-routing.module';

@NgModule({
  imports: [SharedModule, EventProductOrderRoutingModule],
  declarations: [
    EventProductOrderComponent,
    EventProductOrderDetailComponent,
    EventProductOrderUpdateComponent,
    EventProductOrderDeleteDialogComponent,
  ],
  entryComponents: [EventProductOrderDeleteDialogComponent],
})
export class EventProductOrderModule {}
