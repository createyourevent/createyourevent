import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEventComment, getEventCommentIdentifier } from '../event-comment.model';

export type EntityResponseType = HttpResponse<IEventComment>;
export type EntityArrayResponseType = HttpResponse<IEventComment[]>;

@Injectable({ providedIn: 'root' })
export class EventCommentService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/event-comments');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(eventComment: IEventComment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(eventComment);
    return this.http
      .post<IEventComment>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(eventComment: IEventComment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(eventComment);
    return this.http
      .put<IEventComment>(`${this.resourceUrl}/${getEventCommentIdentifier(eventComment) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(eventComment: IEventComment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(eventComment);
    return this.http
      .patch<IEventComment>(`${this.resourceUrl}/${getEventCommentIdentifier(eventComment) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IEventComment>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IEventComment[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addEventCommentToCollectionIfMissing(
    eventCommentCollection: IEventComment[],
    ...eventCommentsToCheck: (IEventComment | null | undefined)[]
  ): IEventComment[] {
    const eventComments: IEventComment[] = eventCommentsToCheck.filter(isPresent);
    if (eventComments.length > 0) {
      const eventCommentCollectionIdentifiers = eventCommentCollection.map(
        eventCommentItem => getEventCommentIdentifier(eventCommentItem)!
      );
      const eventCommentsToAdd = eventComments.filter(eventCommentItem => {
        const eventCommentIdentifier = getEventCommentIdentifier(eventCommentItem);
        if (eventCommentIdentifier == null || eventCommentCollectionIdentifiers.includes(eventCommentIdentifier)) {
          return false;
        }
        eventCommentCollectionIdentifiers.push(eventCommentIdentifier);
        return true;
      });
      return [...eventCommentsToAdd, ...eventCommentCollection];
    }
    return eventCommentCollection;
  }

  protected convertDateFromClient(eventComment: IEventComment): IEventComment {
    return Object.assign({}, eventComment, {
      date: eventComment.date?.isValid() ? eventComment.date.toJSON() : undefined,
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
      res.body.forEach((eventComment: IEventComment) => {
        eventComment.date = eventComment.date ? dayjs(eventComment.date) : undefined;
      });
    }
    return res;
  }
}
