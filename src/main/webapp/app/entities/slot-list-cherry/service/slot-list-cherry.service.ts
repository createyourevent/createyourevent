import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISlotListCherry, getSlotListCherryIdentifier } from '../slot-list-cherry.model';

export type EntityResponseType = HttpResponse<ISlotListCherry>;
export type EntityArrayResponseType = HttpResponse<ISlotListCherry[]>;

@Injectable({ providedIn: 'root' })
export class SlotListCherryService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/slot-list-cherries');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(slotListCherry: ISlotListCherry): Observable<EntityResponseType> {
    return this.http.post<ISlotListCherry>(this.resourceUrl, slotListCherry, { observe: 'response' });
  }

  update(slotListCherry: ISlotListCherry): Observable<EntityResponseType> {
    return this.http.put<ISlotListCherry>(`${this.resourceUrl}/${getSlotListCherryIdentifier(slotListCherry) as number}`, slotListCherry, {
      observe: 'response',
    });
  }

  partialUpdate(slotListCherry: ISlotListCherry): Observable<EntityResponseType> {
    return this.http.patch<ISlotListCherry>(
      `${this.resourceUrl}/${getSlotListCherryIdentifier(slotListCherry) as number}`,
      slotListCherry,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISlotListCherry>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISlotListCherry[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addSlotListCherryToCollectionIfMissing(
    slotListCherryCollection: ISlotListCherry[],
    ...slotListCherriesToCheck: (ISlotListCherry | null | undefined)[]
  ): ISlotListCherry[] {
    const slotListCherries: ISlotListCherry[] = slotListCherriesToCheck.filter(isPresent);
    if (slotListCherries.length > 0) {
      const slotListCherryCollectionIdentifiers = slotListCherryCollection.map(
        slotListCherryItem => getSlotListCherryIdentifier(slotListCherryItem)!
      );
      const slotListCherriesToAdd = slotListCherries.filter(slotListCherryItem => {
        const slotListCherryIdentifier = getSlotListCherryIdentifier(slotListCherryItem);
        if (slotListCherryIdentifier == null || slotListCherryCollectionIdentifiers.includes(slotListCherryIdentifier)) {
          return false;
        }
        slotListCherryCollectionIdentifiers.push(slotListCherryIdentifier);
        return true;
      });
      return [...slotListCherriesToAdd, ...slotListCherryCollection];
    }
    return slotListCherryCollection;
  }
}
