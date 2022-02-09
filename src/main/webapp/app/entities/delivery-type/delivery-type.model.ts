import { IEventProductOrder } from 'app/entities/event-product-order/event-product-order.model';
import { IProduct } from 'app/entities/product/product.model';
import { DeliveryTypes } from 'app/entities/enumerations/delivery-types.model';

export interface IDeliveryType {
  id?: number;
  deliveryType?: DeliveryTypes | null;
  minimumOrderQuantity?: number | null;
  price?: number | null;
  pricePerKilometre?: number | null;
  eventProductOrders?: IEventProductOrder[] | null;
  product?: IProduct | null;
}

export class DeliveryType implements IDeliveryType {
  constructor(
    public id?: number,
    public deliveryType?: DeliveryTypes | null,
    public minimumOrderQuantity?: number | null,
    public price?: number | null,
    public pricePerKilometre?: number | null,
    public eventProductOrders?: IEventProductOrder[] | null,
    public product?: IProduct | null
  ) {}
}

export function getDeliveryTypeIdentifier(deliveryType: IDeliveryType): number | undefined {
  return deliveryType.id;
}
