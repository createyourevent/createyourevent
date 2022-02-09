import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IProductLikeDislike, getProductLikeDislikeIdentifier } from '../product-like-dislike.model';

export type EntityResponseType = HttpResponse<IProductLikeDislike>;
export type EntityArrayResponseType = HttpResponse<IProductLikeDislike[]>;

@Injectable({ providedIn: 'root' })
export class ProductLikeDislikeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/product-like-dislikes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(productLikeDislike: IProductLikeDislike): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(productLikeDislike);
    return this.http
      .post<IProductLikeDislike>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(productLikeDislike: IProductLikeDislike): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(productLikeDislike);
    return this.http
      .put<IProductLikeDislike>(`${this.resourceUrl}/${getProductLikeDislikeIdentifier(productLikeDislike) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(productLikeDislike: IProductLikeDislike): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(productLikeDislike);
    return this.http
      .patch<IProductLikeDislike>(`${this.resourceUrl}/${getProductLikeDislikeIdentifier(productLikeDislike) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IProductLikeDislike>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IProductLikeDislike[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addProductLikeDislikeToCollectionIfMissing(
    productLikeDislikeCollection: IProductLikeDislike[],
    ...productLikeDislikesToCheck: (IProductLikeDislike | null | undefined)[]
  ): IProductLikeDislike[] {
    const productLikeDislikes: IProductLikeDislike[] = productLikeDislikesToCheck.filter(isPresent);
    if (productLikeDislikes.length > 0) {
      const productLikeDislikeCollectionIdentifiers = productLikeDislikeCollection.map(
        productLikeDislikeItem => getProductLikeDislikeIdentifier(productLikeDislikeItem)!
      );
      const productLikeDislikesToAdd = productLikeDislikes.filter(productLikeDislikeItem => {
        const productLikeDislikeIdentifier = getProductLikeDislikeIdentifier(productLikeDislikeItem);
        if (productLikeDislikeIdentifier == null || productLikeDislikeCollectionIdentifiers.includes(productLikeDislikeIdentifier)) {
          return false;
        }
        productLikeDislikeCollectionIdentifiers.push(productLikeDislikeIdentifier);
        return true;
      });
      return [...productLikeDislikesToAdd, ...productLikeDislikeCollection];
    }
    return productLikeDislikeCollection;
  }

  protected convertDateFromClient(productLikeDislike: IProductLikeDislike): IProductLikeDislike {
    return Object.assign({}, productLikeDislike, {
      date: productLikeDislike.date?.isValid() ? productLikeDislike.date.toJSON() : undefined,
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
      res.body.forEach((productLikeDislike: IProductLikeDislike) => {
        productLikeDislike.date = productLikeDislike.date ? dayjs(productLikeDislike.date) : undefined;
      });
    }
    return res;
  }
}
