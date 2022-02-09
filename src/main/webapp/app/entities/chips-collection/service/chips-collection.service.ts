import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IChipsCollection, getChipsCollectionIdentifier } from '../chips-collection.model';

export type EntityResponseType = HttpResponse<IChipsCollection>;
export type EntityArrayResponseType = HttpResponse<IChipsCollection[]>;

@Injectable({ providedIn: 'root' })
export class ChipsCollectionService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/chips-collections');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(chipsCollection: IChipsCollection): Observable<EntityResponseType> {
    return this.http.post<IChipsCollection>(this.resourceUrl, chipsCollection, { observe: 'response' });
  }

  update(chipsCollection: IChipsCollection): Observable<EntityResponseType> {
    return this.http.put<IChipsCollection>(
      `${this.resourceUrl}/${getChipsCollectionIdentifier(chipsCollection) as number}`,
      chipsCollection,
      { observe: 'response' }
    );
  }

  partialUpdate(chipsCollection: IChipsCollection): Observable<EntityResponseType> {
    return this.http.patch<IChipsCollection>(
      `${this.resourceUrl}/${getChipsCollectionIdentifier(chipsCollection) as number}`,
      chipsCollection,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IChipsCollection>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IChipsCollection[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addChipsCollectionToCollectionIfMissing(
    chipsCollectionCollection: IChipsCollection[],
    ...chipsCollectionsToCheck: (IChipsCollection | null | undefined)[]
  ): IChipsCollection[] {
    const chipsCollections: IChipsCollection[] = chipsCollectionsToCheck.filter(isPresent);
    if (chipsCollections.length > 0) {
      const chipsCollectionCollectionIdentifiers = chipsCollectionCollection.map(
        chipsCollectionItem => getChipsCollectionIdentifier(chipsCollectionItem)!
      );
      const chipsCollectionsToAdd = chipsCollections.filter(chipsCollectionItem => {
        const chipsCollectionIdentifier = getChipsCollectionIdentifier(chipsCollectionItem);
        if (chipsCollectionIdentifier == null || chipsCollectionCollectionIdentifiers.includes(chipsCollectionIdentifier)) {
          return false;
        }
        chipsCollectionCollectionIdentifiers.push(chipsCollectionIdentifier);
        return true;
      });
      return [...chipsCollectionsToAdd, ...chipsCollectionCollection];
    }
    return chipsCollectionCollection;
  }
}
