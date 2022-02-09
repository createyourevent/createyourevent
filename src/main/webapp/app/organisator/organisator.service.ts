import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SERVER_API_URL } from "app/app.constants";
import { createRequestOption } from "app/core/request/request-util";
import { ProductType } from "app/entities/enumerations/product-type.model";
import { IProduct } from "app/entities/product/product.model";
import { IReservation } from "app/entities/reservation/reservation.model";
import { IShop } from "app/entities/shop/shop.model";
import { Observable } from "rxjs";


@Injectable({ providedIn: 'root' })
export class OrganisatorService {
  public resourceUrl_shop = SERVER_API_URL + 'api/shops';
  public resourceUrl_product = SERVER_API_URL + 'api/products';
  public resourceUrl_reservation = SERVER_API_URL + 'api/reservations';

  constructor(protected http: HttpClient) {}

  queryShopsWithProductTypeAndActive(type: ProductType, req?: any): Observable<HttpResponse<IShop[]>> {
    const options = createRequestOption(req);
    return this.http.get<IShop[]>(`${this.resourceUrl_shop}/${type}/producttype`, { params: options, observe: 'response' });
  }

  queryProductsWithShopIdAndActive(shopId: number, req?: any): Observable<HttpResponse<IProduct[]>> {
    const options = createRequestOption(req);
    return this.http.get<IProduct[]>(`${this.resourceUrl_product}/${shopId}/active`, { params: options, observe: 'response' });
  }

  findReservationByUserIdAndEventId(userId: string, eventId: number): Observable<HttpResponse<IReservation[]>> {
    return this.http.get<IReservation[]>(`${this.resourceUrl_reservation}/${userId}/${eventId}/getReservationByUserIdAndEventId`, {
      observe: 'response'
    });
  }

  findReservationsByEventId(eventId: number): Observable<HttpResponse<IReservation[]>> {
    return this.http.get<IReservation[]>(`${this.resourceUrl_reservation}/${eventId}/getReservationsByEventId`, { observe: 'response' });
  }
}
