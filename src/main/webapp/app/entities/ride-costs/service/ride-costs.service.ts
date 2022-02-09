import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IRideCosts, getRideCostsIdentifier } from '../ride-costs.model';

export type EntityResponseType = HttpResponse<IRideCosts>;
export type EntityArrayResponseType = HttpResponse<IRideCosts[]>;

@Injectable({ providedIn: 'root' })
export class RideCostsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/ride-costs');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(rideCosts: IRideCosts): Observable<EntityResponseType> {
    return this.http.post<IRideCosts>(this.resourceUrl, rideCosts, { observe: 'response' });
  }

  update(rideCosts: IRideCosts): Observable<EntityResponseType> {
    return this.http.put<IRideCosts>(`${this.resourceUrl}/${getRideCostsIdentifier(rideCosts) as number}`, rideCosts, {
      observe: 'response',
    });
  }

  partialUpdate(rideCosts: IRideCosts): Observable<EntityResponseType> {
    return this.http.patch<IRideCosts>(`${this.resourceUrl}/${getRideCostsIdentifier(rideCosts) as number}`, rideCosts, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IRideCosts>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IRideCosts[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addRideCostsToCollectionIfMissing(
    rideCostsCollection: IRideCosts[],
    ...rideCostsToCheck: (IRideCosts | null | undefined)[]
  ): IRideCosts[] {
    const rideCosts: IRideCosts[] = rideCostsToCheck.filter(isPresent);
    if (rideCosts.length > 0) {
      const rideCostsCollectionIdentifiers = rideCostsCollection.map(rideCostsItem => getRideCostsIdentifier(rideCostsItem)!);
      const rideCostsToAdd = rideCosts.filter(rideCostsItem => {
        const rideCostsIdentifier = getRideCostsIdentifier(rideCostsItem);
        if (rideCostsIdentifier == null || rideCostsCollectionIdentifiers.includes(rideCostsIdentifier)) {
          return false;
        }
        rideCostsCollectionIdentifiers.push(rideCostsIdentifier);
        return true;
      });
      return [...rideCostsToAdd, ...rideCostsCollection];
    }
    return rideCostsCollection;
  }
}
