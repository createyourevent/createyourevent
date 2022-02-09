import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEventProductRatingComment, getEventProductRatingCommentIdentifier } from '../event-product-rating-comment.model';

export type EntityResponseType = HttpResponse<IEventProductRatingComment>;
export type EntityArrayResponseType = HttpResponse<IEventProductRatingComment[]>;

@Injectable({ providedIn: 'root' })
export class EventProductRatingCommentService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/event-product-rating-comments');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(eventProductRatingComment: IEventProductRatingComment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(eventProductRatingComment);
    return this.http
      .post<IEventProductRatingComment>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(eventProductRatingComment: IEventProductRatingComment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(eventProductRatingComment);
    return this.http
      .put<IEventProductRatingComment>(
        `${this.resourceUrl}/${getEventProductRatingCommentIdentifier(eventProductRatingComment) as number}`,
        copy,
        { observe: 'response' }
      )
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(eventProductRatingComment: IEventProductRatingComment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(eventProductRatingComment);
    return this.http
      .patch<IEventProductRatingComment>(
        `${this.resourceUrl}/${getEventProductRatingCommentIdentifier(eventProductRatingComment) as number}`,
        copy,
        { observe: 'response' }
      )
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IEventProductRatingComment>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IEventProductRatingComment[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addEventProductRatingCommentToCollectionIfMissing(
    eventProductRatingCommentCollection: IEventProductRatingComment[],
    ...eventProductRatingCommentsToCheck: (IEventProductRatingComment | null | undefined)[]
  ): IEventProductRatingComment[] {
    const eventProductRatingComments: IEventProductRatingComment[] = eventProductRatingCommentsToCheck.filter(isPresent);
    if (eventProductRatingComments.length > 0) {
      const eventProductRatingCommentCollectionIdentifiers = eventProductRatingCommentCollection.map(
        eventProductRatingCommentItem => getEventProductRatingCommentIdentifier(eventProductRatingCommentItem)!
      );
      const eventProductRatingCommentsToAdd = eventProductRatingComments.filter(eventProductRatingCommentItem => {
        const eventProductRatingCommentIdentifier = getEventProductRatingCommentIdentifier(eventProductRatingCommentItem);
        if (
          eventProductRatingCommentIdentifier == null ||
          eventProductRatingCommentCollectionIdentifiers.includes(eventProductRatingCommentIdentifier)
        ) {
          return false;
        }
        eventProductRatingCommentCollectionIdentifiers.push(eventProductRatingCommentIdentifier);
        return true;
      });
      return [...eventProductRatingCommentsToAdd, ...eventProductRatingCommentCollection];
    }
    return eventProductRatingCommentCollection;
  }

  protected convertDateFromClient(eventProductRatingComment: IEventProductRatingComment): IEventProductRatingComment {
    return Object.assign({}, eventProductRatingComment, {
      date: eventProductRatingComment.date?.isValid() ? eventProductRatingComment.date.toJSON() : undefined,
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
      res.body.forEach((eventProductRatingComment: IEventProductRatingComment) => {
        eventProductRatingComment.date = eventProductRatingComment.date ? dayjs(eventProductRatingComment.date) : undefined;
      });
    }
    return res;
  }
}
