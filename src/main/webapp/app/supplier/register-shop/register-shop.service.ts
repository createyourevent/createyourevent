import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { IShop } from 'app/entities/shop/shop.model';


type EntityResponseType = HttpResponse<IShop>;
type EntityArrayResponseType = HttpResponse<IShop[]>;

@Injectable({ providedIn: 'root' })
export class RegisterShopService {
  public resourceUrl = SERVER_API_URL + 'api/shops';

  constructor(protected http: HttpClient) {}

  createFromUser(shop: IShop): Observable<EntityResponseType> {
    return this.http.post<IShop>(`${this.resourceUrl}/user`, shop, { observe: 'response' });
  }
}
