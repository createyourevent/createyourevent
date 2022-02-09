import { Injectable } from '@angular/core';
import { SERVER_API_URL } from 'app/app.constants';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { createRequestOption } from 'app/core/request/request-util';
import { IShop } from 'app/entities/shop/shop.model';

@Injectable({
  providedIn: 'root'
})
export class SupplierDashboardService {

  public resourceUrl = SERVER_API_URL + 'api/shops';

  constructor(protected http: HttpClient) {}

  queryByUserAndActive(req?: any): Observable<HttpResponse<IShop[]>> {
    const options = createRequestOption(req);
    return this.http.get<IShop[]>(`${this.resourceUrl}/user/active`, { params: options, observe: 'response' });
  }
}
