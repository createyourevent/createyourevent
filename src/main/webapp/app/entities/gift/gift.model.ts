import { IGiftShoppingCart } from 'app/entities/gift-shopping-cart/gift-shopping-cart.model';

export interface IGift {
  id?: number;
  title?: string;
  description?: string;
  photoContentType?: string;
  photo?: string;
  points?: number;
  active?: boolean | null;
  stock?: number | null;
  giftShoppingCarts?: IGiftShoppingCart[] | null;
}

export class Gift implements IGift {
  constructor(
    public id?: number,
    public title?: string,
    public description?: string,
    public photoContentType?: string,
    public photo?: string,
    public points?: number,
    public active?: boolean | null,
    public stock?: number | null,
    public giftShoppingCarts?: IGiftShoppingCart[] | null
  ) {
    this.active = this.active ?? false;
  }
}

export function getGiftIdentifier(gift: IGift): number | undefined {
  return gift.id;
}
