import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/core/request/request-util';
import { IShop } from 'app/entities/shop/shop.model';

type EntityResponseType = HttpResponse<IShop>;
type EntityArrayResponseType = HttpResponse<IShop[]>;

@Injectable({ providedIn: 'root' })
export class RegisterProductService {
  public resourceUrl = SERVER_API_URL + 'api/shops';

  constructor(protected http: HttpClient) {}

  queryByActiveUser(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IShop[]>(`${this.resourceUrl}/user/current`, { params: options, observe: 'response' });
  }
}
