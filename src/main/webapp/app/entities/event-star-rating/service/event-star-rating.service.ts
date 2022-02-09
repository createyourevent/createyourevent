import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEventStarRating, getEventStarRatingIdentifier } from '../event-star-rating.model';

export type EntityResponseType = HttpResponse<IEventStarRating>;
export type EntityArrayResponseType = HttpResponse<IEventStarRating[]>;

@Injectable({ providedIn: 'root' })
export class EventStarRatingService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/event-star-ratings');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(eventStarRating: IEventStarRating): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(eventStarRating);
    return this.http
      .post<IEventStarRating>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(eventStarRating: IEventStarRating): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(eventStarRating);
    return this.http
      .put<IEventStarRating>(`${this.resourceUrl}/${getEventStarRatingIdentifier(eventStarRating) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(eventStarRating: IEventStarRating): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(eventStarRating);
    return this.http
      .patch<IEventStarRating>(`${this.resourceUrl}/${getEventStarRatingIdentifier(eventStarRating) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IEventStarRating>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IEventStarRating[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addEventStarRatingToCollectionIfMissing(
    eventStarRatingCollection: IEventStarRating[],
    ...eventStarRatingsToCheck: (IEventStarRating | null | undefined)[]
  ): IEventStarRating[] {
    const eventStarRatings: IEventStarRating[] = eventStarRatingsToCheck.filter(isPresent);
    if (eventStarRatings.length > 0) {
      const eventStarRatingCollectionIdentifiers = eventStarRatingCollection.map(
        eventStarRatingItem => getEventStarRatingIdentifier(eventStarRatingItem)!
      );
      const eventStarRatingsToAdd = eventStarRatings.filter(eventStarRatingItem => {
        const eventStarRatingIdentifier = getEventStarRatingIdentifier(eventStarRatingItem);
        if (eventStarRatingIdentifier == null || eventStarRatingCollectionIdentifiers.includes(eventStarRatingIdentifier)) {
          return false;
        }
        eventStarRatingCollectionIdentifiers.push(eventStarRatingIdentifier);
        return true;
      });
      return [...eventStarRatingsToAdd, ...eventStarRatingCollection];
    }
    return eventStarRatingCollection;
  }

  protected convertDateFromClient(eventStarRating: IEventStarRating): IEventStarRating {
    return Object.assign({}, eventStarRating, {
      date: eventStarRating.date?.isValid() ? eventStarRating.date.toJSON() : undefined,
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
      res.body.forEach((eventStarRating: IEventStarRating) => {
        eventStarRating.date = eventStarRating.date ? dayjs(eventStarRating.date) : undefined;
      });
    }
    return res;
  }
}
