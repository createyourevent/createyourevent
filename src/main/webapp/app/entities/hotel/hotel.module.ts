import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { HotelComponent } from './list/hotel.component';
import { HotelDetailComponent } from './detail/hotel-detail.component';
import { HotelUpdateComponent } from './update/hotel-update.component';
import { HotelDeleteDialogComponent } from './delete/hotel-delete-dialog.component';
import { HotelRoutingModule } from './route/hotel-routing.module';

@NgModule({
  imports: [SharedModule, HotelRoutingModule],
  declarations: [HotelComponent, HotelDetailComponent, HotelUpdateComponent, HotelDeleteDialogComponent],
})
export class HotelModule {}
