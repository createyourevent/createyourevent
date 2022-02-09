import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IServiceLikeDislike, getServiceLikeDislikeIdentifier } from '../service-like-dislike.model';

export type EntityResponseType = HttpResponse<IServiceLikeDislike>;
export type EntityArrayResponseType = HttpResponse<IServiceLikeDislike[]>;

@Injectable({ providedIn: 'root' })
export class ServiceLikeDislikeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/service-like-dislikes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(serviceLikeDislike: IServiceLikeDislike): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(serviceLikeDislike);
    return this.http
      .post<IServiceLikeDislike>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(serviceLikeDislike: IServiceLikeDislike): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(serviceLikeDislike);
    return this.http
      .put<IServiceLikeDislike>(`${this.resourceUrl}/${getServiceLikeDislikeIdentifier(serviceLikeDislike) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(serviceLikeDislike: IServiceLikeDislike): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(serviceLikeDislike);
    return this.http
      .patch<IServiceLikeDislike>(`${this.resourceUrl}/${getServiceLikeDislikeIdentifier(serviceLikeDislike) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IServiceLikeDislike>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IServiceLikeDislike[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addServiceLikeDislikeToCollectionIfMissing(
    serviceLikeDislikeCollection: IServiceLikeDislike[],
    ...serviceLikeDislikesToCheck: (IServiceLikeDislike | null | undefined)[]
  ): IServiceLikeDislike[] {
    const serviceLikeDislikes: IServiceLikeDislike[] = serviceLikeDislikesToCheck.filter(isPresent);
    if (serviceLikeDislikes.length > 0) {
      const serviceLikeDislikeCollectionIdentifiers = serviceLikeDislikeCollection.map(
        serviceLikeDislikeItem => getServiceLikeDislikeIdentifier(serviceLikeDislikeItem)!
      );
      const serviceLikeDislikesToAdd = serviceLikeDislikes.filter(serviceLikeDislikeItem => {
        const serviceLikeDislikeIdentifier = getServiceLikeDislikeIdentifier(serviceLikeDislikeItem);
        if (serviceLikeDislikeIdentifier == null || serviceLikeDislikeCollectionIdentifiers.includes(serviceLikeDislikeIdentifier)) {
          return false;
        }
        serviceLikeDislikeCollectionIdentifiers.push(serviceLikeDislikeIdentifier);
        return true;
      });
      return [...serviceLikeDislikesToAdd, ...serviceLikeDislikeCollection];
    }
    return serviceLikeDislikeCollection;
  }

  protected convertDateFromClient(serviceLikeDislike: IServiceLikeDislike): IServiceLikeDislike {
    return Object.assign({}, serviceLikeDislike, {
      date: serviceLikeDislike.date?.isValid() ? serviceLikeDislike.date.toJSON() : undefined,
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
      res.body.forEach((serviceLikeDislike: IServiceLikeDislike) => {
        serviceLikeDislike.date = serviceLikeDislike.date ? dayjs(serviceLikeDislike.date) : undefined;
      });
    }
    return res;
  }
}
