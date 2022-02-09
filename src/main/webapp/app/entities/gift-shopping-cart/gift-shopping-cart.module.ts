import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { GiftShoppingCartComponent } from './list/gift-shopping-cart.component';
import { GiftShoppingCartDetailComponent } from './detail/gift-shopping-cart-detail.component';
import { GiftShoppingCartUpdateComponent } from './update/gift-shopping-cart-update.component';
import { GiftShoppingCartDeleteDialogComponent } from './delete/gift-shopping-cart-delete-dialog.component';
import { GiftShoppingCartRoutingModule } from './route/gift-shopping-cart-routing.module';

@NgModule({
  imports: [SharedModule, GiftShoppingCartRoutingModule],
  declarations: [
    GiftShoppingCartComponent,
    GiftShoppingCartDetailComponent,
    GiftShoppingCartUpdateComponent,
    GiftShoppingCartDeleteDialogComponent,
  ],
  entryComponents: [GiftShoppingCartDeleteDialogComponent],
})
export class GiftShoppingCartModule {}
