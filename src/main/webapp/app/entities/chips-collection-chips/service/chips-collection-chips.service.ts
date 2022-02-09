import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IChipsCollectionChips, getChipsCollectionChipsIdentifier } from '../chips-collection-chips.model';

export type EntityResponseType = HttpResponse<IChipsCollectionChips>;
export type EntityArrayResponseType = HttpResponse<IChipsCollectionChips[]>;

@Injectable({ providedIn: 'root' })
export class ChipsCollectionChipsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/chips-collection-chips');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(chipsCollectionChips: IChipsCollectionChips): Observable<EntityResponseType> {
    return this.http.post<IChipsCollectionChips>(this.resourceUrl, chipsCollectionChips, { observe: 'response' });
  }

  update(chipsCollectionChips: IChipsCollectionChips): Observable<EntityResponseType> {
    return this.http.put<IChipsCollectionChips>(
      `${this.resourceUrl}/${getChipsCollectionChipsIdentifier(chipsCollectionChips) as number}`,
      chipsCollectionChips,
      { observe: 'response' }
    );
  }

  partialUpdate(chipsCollectionChips: IChipsCollectionChips): Observable<EntityResponseType> {
    return this.http.patch<IChipsCollectionChips>(
      `${this.resourceUrl}/${getChipsCollectionChipsIdentifier(chipsCollectionChips) as number}`,
      chipsCollectionChips,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IChipsCollectionChips>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IChipsCollectionChips[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addChipsCollectionChipsToCollectionIfMissing(
    chipsCollectionChipsCollection: IChipsCollectionChips[],
    ...chipsCollectionChipsToCheck: (IChipsCollectionChips | null | undefined)[]
  ): IChipsCollectionChips[] {
    const chipsCollectionChips: IChipsCollectionChips[] = chipsCollectionChipsToCheck.filter(isPresent);
    if (chipsCollectionChips.length > 0) {
      const chipsCollectionChipsCollectionIdentifiers = chipsCollectionChipsCollection.map(
        chipsCollectionChipsItem => getChipsCollectionChipsIdentifier(chipsCollectionChipsItem)!
      );
      const chipsCollectionChipsToAdd = chipsCollectionChips.filter(chipsCollectionChipsItem => {
        const chipsCollectionChipsIdentifier = getChipsCollectionChipsIdentifier(chipsCollectionChipsItem);
        if (chipsCollectionChipsIdentifier == null || chipsCollectionChipsCollectionIdentifiers.includes(chipsCollectionChipsIdentifier)) {
          return false;
        }
        chipsCollectionChipsCollectionIdentifiers.push(chipsCollectionChipsIdentifier);
        return true;
      });
      return [...chipsCollectionChipsToAdd, ...chipsCollectionChipsCollection];
    }
    return chipsCollectionChipsCollection;
  }
}
