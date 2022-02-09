import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEventLikeDislike, getEventLikeDislikeIdentifier } from '../event-like-dislike.model';

export type EntityResponseType = HttpResponse<IEventLikeDislike>;
export type EntityArrayResponseType = HttpResponse<IEventLikeDislike[]>;

@Injectable({ providedIn: 'root' })
export class EventLikeDislikeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/event-like-dislikes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(eventLikeDislike: IEventLikeDislike): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(eventLikeDislike);
    return this.http
      .post<IEventLikeDislike>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(eventLikeDislike: IEventLikeDislike): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(eventLikeDislike);
    return this.http
      .put<IEventLikeDislike>(`${this.resourceUrl}/${getEventLikeDislikeIdentifier(eventLikeDislike) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(eventLikeDislike: IEventLikeDislike): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(eventLikeDislike);
    return this.http
      .patch<IEventLikeDislike>(`${this.resourceUrl}/${getEventLikeDislikeIdentifier(eventLikeDislike) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IEventLikeDislike>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IEventLikeDislike[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addEventLikeDislikeToCollectionIfMissing(
    eventLikeDislikeCollection: IEventLikeDislike[],
    ...eventLikeDislikesToCheck: (IEventLikeDislike | null | undefined)[]
  ): IEventLikeDislike[] {
    const eventLikeDislikes: IEventLikeDislike[] = eventLikeDislikesToCheck.filter(isPresent);
    if (eventLikeDislikes.length > 0) {
      const eventLikeDislikeCollectionIdentifiers = eventLikeDislikeCollection.map(
        eventLikeDislikeItem => getEventLikeDislikeIdentifier(eventLikeDislikeItem)!
      );
      const eventLikeDislikesToAdd = eventLikeDislikes.filter(eventLikeDislikeItem => {
        const eventLikeDislikeIdentifier = getEventLikeDislikeIdentifier(eventLikeDislikeItem);
        if (eventLikeDislikeIdentifier == null || eventLikeDislikeCollectionIdentifiers.includes(eventLikeDislikeIdentifier)) {
          return false;
        }
        eventLikeDislikeCollectionIdentifiers.push(eventLikeDislikeIdentifier);
        return true;
      });
      return [...eventLikeDislikesToAdd, ...eventLikeDislikeCollection];
    }
    return eventLikeDislikeCollection;
  }

  protected convertDateFromClient(eventLikeDislike: IEventLikeDislike): IEventLikeDislike {
    return Object.assign({}, eventLikeDislike, {
      date: eventLikeDislike.date?.isValid() ? eventLikeDislike.date.toJSON() : undefined,
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
      res.body.forEach((eventLikeDislike: IEventLikeDislike) => {
        eventLikeDislike.date = eventLikeDislike.date ? dayjs(eventLikeDislike.date) : undefined;
      });
    }
    return res;
  }
}
