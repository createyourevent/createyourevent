import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IServiceStarRating, getServiceStarRatingIdentifier } from '../service-star-rating.model';

export type EntityResponseType = HttpResponse<IServiceStarRating>;
export type EntityArrayResponseType = HttpResponse<IServiceStarRating[]>;

@Injectable({ providedIn: 'root' })
export class ServiceStarRatingService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/service-star-ratings');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(serviceStarRating: IServiceStarRating): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(serviceStarRating);
    return this.http
      .post<IServiceStarRating>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(serviceStarRating: IServiceStarRating): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(serviceStarRating);
    return this.http
      .put<IServiceStarRating>(`${this.resourceUrl}/${getServiceStarRatingIdentifier(serviceStarRating) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(serviceStarRating: IServiceStarRating): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(serviceStarRating);
    return this.http
      .patch<IServiceStarRating>(`${this.resourceUrl}/${getServiceStarRatingIdentifier(serviceStarRating) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IServiceStarRating>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IServiceStarRating[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addServiceStarRatingToCollectionIfMissing(
    serviceStarRatingCollection: IServiceStarRating[],
    ...serviceStarRatingsToCheck: (IServiceStarRating | null | undefined)[]
  ): IServiceStarRating[] {
    const serviceStarRatings: IServiceStarRating[] = serviceStarRatingsToCheck.filter(isPresent);
    if (serviceStarRatings.length > 0) {
      const serviceStarRatingCollectionIdentifiers = serviceStarRatingCollection.map(
        serviceStarRatingItem => getServiceStarRatingIdentifier(serviceStarRatingItem)!
      );
      const serviceStarRatingsToAdd = serviceStarRatings.filter(serviceStarRatingItem => {
        const serviceStarRatingIdentifier = getServiceStarRatingIdentifier(serviceStarRatingItem);
        if (serviceStarRatingIdentifier == null || serviceStarRatingCollectionIdentifiers.includes(serviceStarRatingIdentifier)) {
          return false;
        }
        serviceStarRatingCollectionIdentifiers.push(serviceStarRatingIdentifier);
        return true;
      });
      return [...serviceStarRatingsToAdd, ...serviceStarRatingCollection];
    }
    return serviceStarRatingCollection;
  }

  protected convertDateFromClient(serviceStarRating: IServiceStarRating): IServiceStarRating {
    return Object.assign({}, serviceStarRating, {
      date: serviceStarRating.date?.isValid() ? serviceStarRating.date.toJSON() : undefined,
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
      res.body.forEach((serviceStarRating: IServiceStarRating) => {
        serviceStarRating.date = serviceStarRating.date ? dayjs(serviceStarRating.date) : undefined;
      });
    }
    return res;
  }
}
