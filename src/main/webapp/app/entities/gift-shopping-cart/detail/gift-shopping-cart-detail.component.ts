import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IGiftShoppingCart } from '../gift-shopping-cart.model';

@Component({
  selector: 'jhi-gift-shopping-cart-detail',
  templateUrl: './gift-shopping-cart-detail.component.html',
})
export class GiftShoppingCartDetailComponent implements OnInit {
  giftShoppingCart: IGiftShoppingCart | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ giftShoppingCart }) => {
      this.giftShoppingCart = giftShoppingCart;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
