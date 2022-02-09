import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { IUser } from '../../core/user/user.model';
import { IProduct } from '../../shared/model/product.model';
//import { IProductrating } from 'app/shared/model/productrating.model';

type EntityResponseType = HttpResponse<IUser>;
type EntityArrayResponseTypeProductrating = HttpResponse<IProduct[]>;

@Injectable({ providedIn: 'root' })
export class ProductViewService {
  public resourceUrl = SERVER_API_URL + 'api/users';
  public resourceUrlEventrating = SERVER_API_URL + 'api/productratings';
  public resourceUrlEvent = SERVER_API_URL + 'api/products';

  constructor(protected http: HttpClient) {}

  findWidthAuthorities(): Observable<EntityResponseType> {
    return this.http
      .get<IUser>(`${this.resourceUrl}/all`, { observe: 'response' });
  }

  /*
  findProductRatingsByProduct(id: number): Observable<EntityArrayResponseTypeProductrating> {
    return this.http
    .get<IProductrating[]>(`${this.resourceUrlEventrating}/${id}/all`, { observe: 'response' });
  }

  findProductratingByUserAndProduct(userId: string, eventId: number): Observable<HttpResponse<IProductrating>> {
    return this.http
    .get<IProductrating>(`${this.resourceUrlEventrating}/${userId}/${eventId}/productAndUser`, { observe: 'response' });
  }
  */
}
