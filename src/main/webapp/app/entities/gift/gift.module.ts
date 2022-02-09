import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { GiftComponent } from './list/gift.component';
import { GiftDetailComponent } from './detail/gift-detail.component';
import { GiftUpdateComponent } from './update/gift-update.component';
import { GiftDeleteDialogComponent } from './delete/gift-delete-dialog.component';
import { GiftRoutingModule } from './route/gift-routing.module';

@NgModule({
  imports: [SharedModule, GiftRoutingModule],
  declarations: [GiftComponent, GiftDetailComponent, GiftUpdateComponent, GiftDeleteDialogComponent],
  entryComponents: [GiftDeleteDialogComponent],
})
export class GiftModule {}
