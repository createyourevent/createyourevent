import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IShopLikeDislike, getShopLikeDislikeIdentifier } from '../shop-like-dislike.model';

export type EntityResponseType = HttpResponse<IShopLikeDislike>;
export type EntityArrayResponseType = HttpResponse<IShopLikeDislike[]>;

@Injectable({ providedIn: 'root' })
export class ShopLikeDislikeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/shop-like-dislikes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(shopLikeDislike: IShopLikeDislike): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(shopLikeDislike);
    return this.http
      .post<IShopLikeDislike>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(shopLikeDislike: IShopLikeDislike): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(shopLikeDislike);
    return this.http
      .put<IShopLikeDislike>(`${this.resourceUrl}/${getShopLikeDislikeIdentifier(shopLikeDislike) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(shopLikeDislike: IShopLikeDislike): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(shopLikeDislike);
    return this.http
      .patch<IShopLikeDislike>(`${this.resourceUrl}/${getShopLikeDislikeIdentifier(shopLikeDislike) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IShopLikeDislike>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IShopLikeDislike[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addShopLikeDislikeToCollectionIfMissing(
    shopLikeDislikeCollection: IShopLikeDislike[],
    ...shopLikeDislikesToCheck: (IShopLikeDislike | null | undefined)[]
  ): IShopLikeDislike[] {
    const shopLikeDislikes: IShopLikeDislike[] = shopLikeDislikesToCheck.filter(isPresent);
    if (shopLikeDislikes.length > 0) {
      const shopLikeDislikeCollectionIdentifiers = shopLikeDislikeCollection.map(
        shopLikeDislikeItem => getShopLikeDislikeIdentifier(shopLikeDislikeItem)!
      );
      const shopLikeDislikesToAdd = shopLikeDislikes.filter(shopLikeDislikeItem => {
        const shopLikeDislikeIdentifier = getShopLikeDislikeIdentifier(shopLikeDislikeItem);
        if (shopLikeDislikeIdentifier == null || shopLikeDislikeCollectionIdentifiers.includes(shopLikeDislikeIdentifier)) {
          return false;
        }
        shopLikeDislikeCollectionIdentifiers.push(shopLikeDislikeIdentifier);
        return true;
      });
      return [...shopLikeDislikesToAdd, ...shopLikeDislikeCollection];
    }
    return shopLikeDislikeCollection;
  }

  protected convertDateFromClient(shopLikeDislike: IShopLikeDislike): IShopLikeDislike {
    return Object.assign({}, shopLikeDislike, {
      date: shopLikeDislike.date?.isValid() ? shopLikeDislike.date.toJSON() : undefined,
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
      res.body.forEach((shopLikeDislike: IShopLikeDislike) => {
        shopLikeDislike.date = shopLikeDislike.date ? dayjs(shopLikeDislike.date) : undefined;
      });
    }
    return res;
  }
}
