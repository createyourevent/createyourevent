import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISlotListClock, getSlotListClockIdentifier } from '../slot-list-clock.model';

export type EntityResponseType = HttpResponse<ISlotListClock>;
export type EntityArrayResponseType = HttpResponse<ISlotListClock[]>;

@Injectable({ providedIn: 'root' })
export class SlotListClockService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/slot-list-clocks');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(slotListClock: ISlotListClock): Observable<EntityResponseType> {
    return this.http.post<ISlotListClock>(this.resourceUrl, slotListClock, { observe: 'response' });
  }

  update(slotListClock: ISlotListClock): Observable<EntityResponseType> {
    return this.http.put<ISlotListClock>(`${this.resourceUrl}/${getSlotListClockIdentifier(slotListClock) as number}`, slotListClock, {
      observe: 'response',
    });
  }

  partialUpdate(slotListClock: ISlotListClock): Observable<EntityResponseType> {
    return this.http.patch<ISlotListClock>(`${this.resourceUrl}/${getSlotListClockIdentifier(slotListClock) as number}`, slotListClock, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISlotListClock>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISlotListClock[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addSlotListClockToCollectionIfMissing(
    slotListClockCollection: ISlotListClock[],
    ...slotListClocksToCheck: (ISlotListClock | null | undefined)[]
  ): ISlotListClock[] {
    const slotListClocks: ISlotListClock[] = slotListClocksToCheck.filter(isPresent);
    if (slotListClocks.length > 0) {
      const slotListClockCollectionIdentifiers = slotListClockCollection.map(
        slotListClockItem => getSlotListClockIdentifier(slotListClockItem)!
      );
      const slotListClocksToAdd = slotListClocks.filter(slotListClockItem => {
        const slotListClockIdentifier = getSlotListClockIdentifier(slotListClockItem);
        if (slotListClockIdentifier == null || slotListClockCollectionIdentifiers.includes(slotListClockIdentifier)) {
          return false;
        }
        slotListClockCollectionIdentifiers.push(slotListClockIdentifier);
        return true;
      });
      return [...slotListClocksToAdd, ...slotListClockCollection];
    }
    return slotListClockCollection;
  }
}
