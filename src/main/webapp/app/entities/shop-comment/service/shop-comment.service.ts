import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IShopComment, getShopCommentIdentifier } from '../shop-comment.model';

export type EntityResponseType = HttpResponse<IShopComment>;
export type EntityArrayResponseType = HttpResponse<IShopComment[]>;

@Injectable({ providedIn: 'root' })
export class ShopCommentService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/shop-comments');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(shopComment: IShopComment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(shopComment);
    return this.http
      .post<IShopComment>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(shopComment: IShopComment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(shopComment);
    return this.http
      .put<IShopComment>(`${this.resourceUrl}/${getShopCommentIdentifier(shopComment) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(shopComment: IShopComment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(shopComment);
    return this.http
      .patch<IShopComment>(`${this.resourceUrl}/${getShopCommentIdentifier(shopComment) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IShopComment>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IShopComment[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addShopCommentToCollectionIfMissing(
    shopCommentCollection: IShopComment[],
    ...shopCommentsToCheck: (IShopComment | null | undefined)[]
  ): IShopComment[] {
    const shopComments: IShopComment[] = shopCommentsToCheck.filter(isPresent);
    if (shopComments.length > 0) {
      const shopCommentCollectionIdentifiers = shopCommentCollection.map(shopCommentItem => getShopCommentIdentifier(shopCommentItem)!);
      const shopCommentsToAdd = shopComments.filter(shopCommentItem => {
        const shopCommentIdentifier = getShopCommentIdentifier(shopCommentItem);
        if (shopCommentIdentifier == null || shopCommentCollectionIdentifiers.includes(shopCommentIdentifier)) {
          return false;
        }
        shopCommentCollectionIdentifiers.push(shopCommentIdentifier);
        return true;
      });
      return [...shopCommentsToAdd, ...shopCommentCollection];
    }
    return shopCommentCollection;
  }

  protected convertDateFromClient(shopComment: IShopComment): IShopComment {
    return Object.assign({}, shopComment, {
      date: shopComment.date?.isValid() ? shopComment.date.toJSON() : undefined,
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
      res.body.forEach((shopComment: IShopComment) => {
        shopComment.date = shopComment.date ? dayjs(shopComment.date) : undefined;
      });
    }
    return res;
  }
}
