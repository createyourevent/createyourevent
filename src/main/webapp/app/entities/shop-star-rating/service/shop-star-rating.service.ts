import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IShopStarRating, getShopStarRatingIdentifier } from '../shop-star-rating.model';

export type EntityResponseType = HttpResponse<IShopStarRating>;
export type EntityArrayResponseType = HttpResponse<IShopStarRating[]>;

@Injectable({ providedIn: 'root' })
export class ShopStarRatingService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/shop-star-ratings');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(shopStarRating: IShopStarRating): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(shopStarRating);
    return this.http
      .post<IShopStarRating>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(shopStarRating: IShopStarRating): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(shopStarRating);
    return this.http
      .put<IShopStarRating>(`${this.resourceUrl}/${getShopStarRatingIdentifier(shopStarRating) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(shopStarRating: IShopStarRating): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(shopStarRating);
    return this.http
      .patch<IShopStarRating>(`${this.resourceUrl}/${getShopStarRatingIdentifier(shopStarRating) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IShopStarRating>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IShopStarRating[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addShopStarRatingToCollectionIfMissing(
    shopStarRatingCollection: IShopStarRating[],
    ...shopStarRatingsToCheck: (IShopStarRating | null | undefined)[]
  ): IShopStarRating[] {
    const shopStarRatings: IShopStarRating[] = shopStarRatingsToCheck.filter(isPresent);
    if (shopStarRatings.length > 0) {
      const shopStarRatingCollectionIdentifiers = shopStarRatingCollection.map(
        shopStarRatingItem => getShopStarRatingIdentifier(shopStarRatingItem)!
      );
      const shopStarRatingsToAdd = shopStarRatings.filter(shopStarRatingItem => {
        const shopStarRatingIdentifier = getShopStarRatingIdentifier(shopStarRatingItem);
        if (shopStarRatingIdentifier == null || shopStarRatingCollectionIdentifiers.includes(shopStarRatingIdentifier)) {
          return false;
        }
        shopStarRatingCollectionIdentifiers.push(shopStarRatingIdentifier);
        return true;
      });
      return [...shopStarRatingsToAdd, ...shopStarRatingCollection];
    }
    return shopStarRatingCollection;
  }

  protected convertDateFromClient(shopStarRating: IShopStarRating): IShopStarRating {
    return Object.assign({}, shopStarRating, {
      date: shopStarRating.date?.isValid() ? shopStarRating.date.toJSON() : undefined,
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
      res.body.forEach((shopStarRating: IShopStarRating) => {
        shopStarRating.date = shopStarRating.date ? dayjs(shopStarRating.date) : undefined;
      });
    }
    return res;
  }
}
