import { HttpResponse, HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SERVER_API_URL } from "app/app.constants";
import { createRequestOption } from "app/core/request/request-util";
import { IEventProductOrder } from "app/entities/event-product-order/event-product-order.model";
import { IProduct } from "app/entities/product/product.model";
import { IShop } from "app/entities/shop/shop.model";
import { Observable } from "rxjs";


type EntityResponseType = HttpResponse<IShop>;
type EntityArrayResponseType = HttpResponse<IShop[]>;

@Injectable({ providedIn: 'root' })
export class SupplierService {
  public resourceUrl_shop = SERVER_API_URL + 'api/shops';
  public resourceUrl_product = SERVER_API_URL + 'api/products';
  public resourceUrl_eventProductOrder = SERVER_API_URL + 'api/event-product-orders';

  constructor(protected http: HttpClient) {}

  queryProductsFromShop(shopId: number, req?: any): Observable<HttpResponse<IProduct[]>> {
    const options = createRequestOption(req);
    return this.http.get<IProduct[]>(`${this.resourceUrl_product}/${shopId}/all`, { params: options, observe: 'response' });
  }

  queryEventProductOrdersByProduct(productId: number, req?: any): Observable<HttpResponse<IEventProductOrder[]>> {
    const options = createRequestOption(req);
    return this.http.get<IEventProductOrder[]>(`${this.resourceUrl_eventProductOrder}/${productId}/getEventProductOrderByProduct`, {
      params: options,
      observe: 'response'
    });
  }
}
