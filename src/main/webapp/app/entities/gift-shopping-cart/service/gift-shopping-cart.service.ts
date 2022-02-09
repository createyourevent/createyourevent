import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IGiftShoppingCart, getGiftShoppingCartIdentifier } from '../gift-shopping-cart.model';

export type EntityResponseType = HttpResponse<IGiftShoppingCart>;
export type EntityArrayResponseType = HttpResponse<IGiftShoppingCart[]>;

@Injectable({ providedIn: 'root' })
export class GiftShoppingCartService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/gift-shopping-carts');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(giftShoppingCart: IGiftShoppingCart): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(giftShoppingCart);
    return this.http
      .post<IGiftShoppingCart>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(giftShoppingCart: IGiftShoppingCart): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(giftShoppingCart);
    return this.http
      .put<IGiftShoppingCart>(`${this.resourceUrl}/${getGiftShoppingCartIdentifier(giftShoppingCart) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(giftShoppingCart: IGiftShoppingCart): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(giftShoppingCart);
    return this.http
      .patch<IGiftShoppingCart>(`${this.resourceUrl}/${getGiftShoppingCartIdentifier(giftShoppingCart) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IGiftShoppingCart>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IGiftShoppingCart[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addGiftShoppingCartToCollectionIfMissing(
    giftShoppingCartCollection: IGiftShoppingCart[],
    ...giftShoppingCartsToCheck: (IGiftShoppingCart | null | undefined)[]
  ): IGiftShoppingCart[] {
    const giftShoppingCarts: IGiftShoppingCart[] = giftShoppingCartsToCheck.filter(isPresent);
    if (giftShoppingCarts.length > 0) {
      const giftShoppingCartCollectionIdentifiers = giftShoppingCartCollection.map(
        giftShoppingCartItem => getGiftShoppingCartIdentifier(giftShoppingCartItem)!
      );
      const giftShoppingCartsToAdd = giftShoppingCarts.filter(giftShoppingCartItem => {
        const giftShoppingCartIdentifier = getGiftShoppingCartIdentifier(giftShoppingCartItem);
        if (giftShoppingCartIdentifier == null || giftShoppingCartCollectionIdentifiers.includes(giftShoppingCartIdentifier)) {
          return false;
        }
        giftShoppingCartCollectionIdentifiers.push(giftShoppingCartIdentifier);
        return true;
      });
      return [...giftShoppingCartsToAdd, ...giftShoppingCartCollection];
    }
    return giftShoppingCartCollection;
  }

  protected convertDateFromClient(giftShoppingCart: IGiftShoppingCart): IGiftShoppingCart {
    return Object.assign({}, giftShoppingCart, {
      date: giftShoppingCart.date?.isValid() ? giftShoppingCart.date.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.date = res.body.date ? dayjs(res.body.date) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((giftShoppingCart: IGiftShoppingCart) => {
        giftShoppingCart.date = giftShoppingCart.date ? dayjs(giftShoppingCart.date) : undefined;
      });
    }
    return res;
  }
}
