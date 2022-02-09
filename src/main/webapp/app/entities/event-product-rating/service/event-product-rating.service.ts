import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEventProductRating, getEventProductRatingIdentifier } from '../event-product-rating.model';

export type EntityResponseType = HttpResponse<IEventProductRating>;
export type EntityArrayResponseType = HttpResponse<IEventProductRating[]>;

@Injectable({ providedIn: 'root' })
export class EventProductRatingService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/event-product-ratings');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(eventProductRating: IEventProductRating): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(eventProductRating);
    return this.http
      .post<IEventProductRating>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(eventProductRating: IEventProductRating): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(eventProductRating);
    return this.http
      .put<IEventProductRating>(`${this.resourceUrl}/${getEventProductRatingIdentifier(eventProductRating) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(eventProductRating: IEventProductRating): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(eventProductRating);
    return this.http
      .patch<IEventProductRating>(`${this.resourceUrl}/${getEventProductRatingIdentifier(eventProductRating) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IEventProductRating>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IEventProductRating[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addEventProductRatingToCollectionIfMissing(
    eventProductRatingCollection: IEventProductRating[],
    ...eventProductRatingsToCheck: (IEventProductRating | null | undefined)[]
  ): IEventProductRating[] {
    const eventProductRatings: IEventProductRating[] = eventProductRatingsToCheck.filter(isPresent);
    if (eventProductRatings.length > 0) {
      const eventProductRatingCollectionIdentifiers = eventProductRatingCollection.map(
        eventProductRatingItem => getEventProductRatingIdentifier(eventProductRatingItem)!
      );
      const eventProductRatingsToAdd = eventProductRatings.filter(eventProductRatingItem => {
        const eventProductRatingIdentifier = getEventProductRatingIdentifier(eventProductRatingItem);
        if (eventProductRatingIdentifier == null || eventProductRatingCollectionIdentifiers.includes(eventProductRatingIdentifier)) {
          return false;
        }
        eventProductRatingCollectionIdentifiers.push(eventProductRatingIdentifier);
        return true;
      });
      return [...eventProductRatingsToAdd, ...eventProductRatingCollection];
    }
    return eventProductRatingCollection;
  }

  protected convertDateFromClient(eventProductRating: IEventProductRating): IEventProductRating {
    return Object.assign({}, eventProductRating, {
      date: eventProductRating.date?.isValid() ? eventProductRating.date.toJSON() : undefined,
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
      res.body.forEach((eventProductRating: IEventProductRating) => {
        eventProductRating.date = eventProductRating.date ? dayjs(eventProductRating.date) : undefined;
      });
    }
    return res;
  }
}
