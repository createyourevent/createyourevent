import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPointsExchange, getPointsExchangeIdentifier } from '../points-exchange.model';

export type EntityResponseType = HttpResponse<IPointsExchange>;
export type EntityArrayResponseType = HttpResponse<IPointsExchange[]>;

@Injectable({ providedIn: 'root' })
export class PointsExchangeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/points-exchanges');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(pointsExchange: IPointsExchange): Observable<EntityResponseType> {
    return this.http.post<IPointsExchange>(this.resourceUrl, pointsExchange, { observe: 'response' });
  }

  update(pointsExchange: IPointsExchange): Observable<EntityResponseType> {
    return this.http.put<IPointsExchange>(`${this.resourceUrl}/${getPointsExchangeIdentifier(pointsExchange) as number}`, pointsExchange, {
      observe: 'response',
    });
  }

  partialUpdate(pointsExchange: IPointsExchange): Observable<EntityResponseType> {
    return this.http.patch<IPointsExchange>(
      `${this.resourceUrl}/${getPointsExchangeIdentifier(pointsExchange) as number}`,
      pointsExchange,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPointsExchange>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPointsExchange[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addPointsExchangeToCollectionIfMissing(
    pointsExchangeCollection: IPointsExchange[],
    ...pointsExchangesToCheck: (IPointsExchange | null | undefined)[]
  ): IPointsExchange[] {
    const pointsExchanges: IPointsExchange[] = pointsExchangesToCheck.filter(isPresent);
    if (pointsExchanges.length > 0) {
      const pointsExchangeCollectionIdentifiers = pointsExchangeCollection.map(
        pointsExchangeItem => getPointsExchangeIdentifier(pointsExchangeItem)!
      );
      const pointsExchangesToAdd = pointsExchanges.filter(pointsExchangeItem => {
        const pointsExchangeIdentifier = getPointsExchangeIdentifier(pointsExchangeItem);
        if (pointsExchangeIdentifier == null || pointsExchangeCollectionIdentifiers.includes(pointsExchangeIdentifier)) {
          return false;
        }
        pointsExchangeCollectionIdentifiers.push(pointsExchangeIdentifier);
        return true;
      });
      return [...pointsExchangesToAdd, ...pointsExchangeCollection];
    }
    return pointsExchangeCollection;
  }
}
