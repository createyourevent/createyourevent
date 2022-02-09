import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IGiftShoppingCart } from '../gift-shopping-cart.model';
import { GiftShoppingCartService } from '../service/gift-shopping-cart.service';

@Component({
  templateUrl: './gift-shopping-cart-delete-dialog.component.html',
})
export class GiftShoppingCartDeleteDialogComponent {
  giftShoppingCart?: IGiftShoppingCart;

  constructor(protected giftShoppingCartService: GiftShoppingCartService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.giftShoppingCartService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
