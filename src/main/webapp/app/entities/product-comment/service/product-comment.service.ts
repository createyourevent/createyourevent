import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IProductComment, getProductCommentIdentifier } from '../product-comment.model';

export type EntityResponseType = HttpResponse<IProductComment>;
export type EntityArrayResponseType = HttpResponse<IProductComment[]>;

@Injectable({ providedIn: 'root' })
export class ProductCommentService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/product-comments');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(productComment: IProductComment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(productComment);
    return this.http
      .post<IProductComment>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(productComment: IProductComment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(productComment);
    return this.http
      .put<IProductComment>(`${this.resourceUrl}/${getProductCommentIdentifier(productComment) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(productComment: IProductComment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(productComment);
    return this.http
      .patch<IProductComment>(`${this.resourceUrl}/${getProductCommentIdentifier(productComment) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IProductComment>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IProductComment[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addProductCommentToCollectionIfMissing(
    productCommentCollection: IProductComment[],
    ...productCommentsToCheck: (IProductComment | null | undefined)[]
  ): IProductComment[] {
    const productComments: IProductComment[] = productCommentsToCheck.filter(isPresent);
    if (productComments.length > 0) {
      const productCommentCollectionIdentifiers = productCommentCollection.map(
        productCommentItem => getProductCommentIdentifier(productCommentItem)!
      );
      const productCommentsToAdd = productComments.filter(productCommentItem => {
        const productCommentIdentifier = getProductCommentIdentifier(productCommentItem);
        if (productCommentIdentifier == null || productCommentCollectionIdentifiers.includes(productCommentIdentifier)) {
          return false;
        }
        productCommentCollectionIdentifiers.push(productCommentIdentifier);
        return true;
      });
      return [...productCommentsToAdd, ...productCommentCollection];
    }
    return productCommentCollection;
  }

  protected convertDateFromClient(productComment: IProductComment): IProductComment {
    return Object.assign({}, productComment, {
      date: productComment.date?.isValid() ? productComment.date.toJSON() : undefined,
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
      res.body.forEach((productComment: IProductComment) => {
        productComment.date = productComment.date ? dayjs(productComment.date) : undefined;
      });
    }
    return res;
  }
}
