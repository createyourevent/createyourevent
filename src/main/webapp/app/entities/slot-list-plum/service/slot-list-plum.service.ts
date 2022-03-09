import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISlotListPlum, getSlotListPlumIdentifier } from '../slot-list-plum.model';

export type EntityResponseType = HttpResponse<ISlotListPlum>;
export type EntityArrayResponseType = HttpResponse<ISlotListPlum[]>;

@Injectable({ providedIn: 'root' })
export class SlotListPlumService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/slot-list-plums');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(slotListPlum: ISlotListPlum): Observable<EntityResponseType> {
    return this.http.post<ISlotListPlum>(this.resourceUrl, slotListPlum, { observe: 'response' });
  }

  update(slotListPlum: ISlotListPlum): Observable<EntityResponseType> {
    return this.http.put<ISlotListPlum>(`${this.resourceUrl}/${getSlotListPlumIdentifier(slotListPlum) as number}`, slotListPlum, {
      observe: 'response',
    });
  }

  partialUpdate(slotListPlum: ISlotListPlum): Observable<EntityResponseType> {
    return this.http.patch<ISlotListPlum>(`${this.resourceUrl}/${getSlotListPlumIdentifier(slotListPlum) as number}`, slotListPlum, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISlotListPlum>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISlotListPlum[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addSlotListPlumToCollectionIfMissing(
    slotListPlumCollection: ISlotListPlum[],
    ...slotListPlumsToCheck: (ISlotListPlum | null | undefined)[]
  ): ISlotListPlum[] {
    const slotListPlums: ISlotListPlum[] = slotListPlumsToCheck.filter(isPresent);
    if (slotListPlums.length > 0) {
      const slotListPlumCollectionIdentifiers = slotListPlumCollection.map(
        slotListPlumItem => getSlotListPlumIdentifier(slotListPlumItem)!
      );
      const slotListPlumsToAdd = slotListPlums.filter(slotListPlumItem => {
        const slotListPlumIdentifier = getSlotListPlumIdentifier(slotListPlumItem);
        if (slotListPlumIdentifier == null || slotListPlumCollectionIdentifiers.includes(slotListPlumIdentifier)) {
          return false;
        }
        slotListPlumCollectionIdentifiers.push(slotListPlumIdentifier);
        return true;
      });
      return [...slotListPlumsToAdd, ...slotListPlumCollection];
    }
    return slotListPlumCollection;
  }
}
