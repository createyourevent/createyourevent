import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IProductStarRating, getProductStarRatingIdentifier } from '../product-star-rating.model';

export type EntityResponseType = HttpResponse<IProductStarRating>;
export type EntityArrayResponseType = HttpResponse<IProductStarRating[]>;

@Injectable({ providedIn: 'root' })
export class ProductStarRatingService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/product-star-ratings');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(productStarRating: IProductStarRating): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(productStarRating);
    return this.http
      .post<IProductStarRating>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(productStarRating: IProductStarRating): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(productStarRating);
    return this.http
      .put<IProductStarRating>(`${this.resourceUrl}/${getProductStarRatingIdentifier(productStarRating) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(productStarRating: IProductStarRating): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(productStarRating);
    return this.http
      .patch<IProductStarRating>(`${this.resourceUrl}/${getProductStarRatingIdentifier(productStarRating) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IProductStarRating>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IProductStarRating[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addProductStarRatingToCollectionIfMissing(
    productStarRatingCollection: IProductStarRating[],
    ...productStarRatingsToCheck: (IProductStarRating | null | undefined)[]
  ): IProductStarRating[] {
    const productStarRatings: IProductStarRating[] = productStarRatingsToCheck.filter(isPresent);
    if (productStarRatings.length > 0) {
      const productStarRatingCollectionIdentifiers = productStarRatingCollection.map(
        productStarRatingItem => getProductStarRatingIdentifier(productStarRatingItem)!
      );
      const productStarRatingsToAdd = productStarRatings.filter(productStarRatingItem => {
        const productStarRatingIdentifier = getProductStarRatingIdentifier(productStarRatingItem);
        if (productStarRatingIdentifier == null || productStarRatingCollectionIdentifiers.includes(productStarRatingIdentifier)) {
          return false;
        }
        productStarRatingCollectionIdentifiers.push(productStarRatingIdentifier);
        return true;
      });
      return [...productStarRatingsToAdd, ...productStarRatingCollection];
    }
    return productStarRatingCollection;
  }

  protected convertDateFromClient(productStarRating: IProductStarRating): IProductStarRating {
    return Object.assign({}, productStarRating, {
      date: productStarRating.date?.isValid() ? productStarRating.date.toJSON() : undefined,
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
      res.body.forEach((productStarRating: IProductStarRating) => {
        productStarRating.date = productStarRating.date ? dayjs(productStarRating.date) : undefined;
      });
    }
    return res;
  }
}
