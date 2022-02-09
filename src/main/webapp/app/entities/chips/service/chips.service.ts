import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IChips, getChipsIdentifier } from '../chips.model';

export type EntityResponseType = HttpResponse<IChips>;
export type EntityArrayResponseType = HttpResponse<IChips[]>;

@Injectable({ providedIn: 'root' })
export class ChipsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/chips');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(chips: IChips): Observable<EntityResponseType> {
    return this.http.post<IChips>(this.resourceUrl, chips, { observe: 'response' });
  }

  update(chips: IChips): Observable<EntityResponseType> {
    return this.http.put<IChips>(`${this.resourceUrl}/${getChipsIdentifier(chips) as number}`, chips, { observe: 'response' });
  }

  partialUpdate(chips: IChips): Observable<EntityResponseType> {
    return this.http.patch<IChips>(`${this.resourceUrl}/${getChipsIdentifier(chips) as number}`, chips, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IChips>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IChips[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addChipsToCollectionIfMissing(chipsCollection: IChips[], ...chipsToCheck: (IChips | null | undefined)[]): IChips[] {
    const chips: IChips[] = chipsToCheck.filter(isPresent);
    if (chips.length > 0) {
      const chipsCollectionIdentifiers = chipsCollection.map(chipsItem => getChipsIdentifier(chipsItem)!);
      const chipsToAdd = chips.filter(chipsItem => {
        const chipsIdentifier = getChipsIdentifier(chipsItem);
        if (chipsIdentifier == null || chipsCollectionIdentifiers.includes(chipsIdentifier)) {
          return false;
        }
        chipsCollectionIdentifiers.push(chipsIdentifier);
        return true;
      });
      return [...chipsToAdd, ...chipsCollection];
    }
    return chipsCollection;
  }
}
