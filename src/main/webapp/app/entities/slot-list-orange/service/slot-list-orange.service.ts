import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISlotListOrange, getSlotListOrangeIdentifier } from '../slot-list-orange.model';

export type EntityResponseType = HttpResponse<ISlotListOrange>;
export type EntityArrayResponseType = HttpResponse<ISlotListOrange[]>;

@Injectable({ providedIn: 'root' })
export class SlotListOrangeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/slot-list-oranges');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(slotListOrange: ISlotListOrange): Observable<EntityResponseType> {
    return this.http.post<ISlotListOrange>(this.resourceUrl, slotListOrange, { observe: 'response' });
  }

  update(slotListOrange: ISlotListOrange): Observable<EntityResponseType> {
    return this.http.put<ISlotListOrange>(`${this.resourceUrl}/${getSlotListOrangeIdentifier(slotListOrange) as number}`, slotListOrange, {
      observe: 'response',
    });
  }

  partialUpdate(slotListOrange: ISlotListOrange): Observable<EntityResponseType> {
    return this.http.patch<ISlotListOrange>(
      `${this.resourceUrl}/${getSlotListOrangeIdentifier(slotListOrange) as number}`,
      slotListOrange,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISlotListOrange>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISlotListOrange[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addSlotListOrangeToCollectionIfMissing(
    slotListOrangeCollection: ISlotListOrange[],
    ...slotListOrangesToCheck: (ISlotListOrange | null | undefined)[]
  ): ISlotListOrange[] {
    const slotListOranges: ISlotListOrange[] = slotListOrangesToCheck.filter(isPresent);
    if (slotListOranges.length > 0) {
      const slotListOrangeCollectionIdentifiers = slotListOrangeCollection.map(
        slotListOrangeItem => getSlotListOrangeIdentifier(slotListOrangeItem)!
      );
      const slotListOrangesToAdd = slotListOranges.filter(slotListOrangeItem => {
        const slotListOrangeIdentifier = getSlotListOrangeIdentifier(slotListOrangeItem);
        if (slotListOrangeIdentifier == null || slotListOrangeCollectionIdentifiers.includes(slotListOrangeIdentifier)) {
          return false;
        }
        slotListOrangeCollectionIdentifiers.push(slotListOrangeIdentifier);
        return true;
      });
      return [...slotListOrangesToAdd, ...slotListOrangeCollection];
    }
    return slotListOrangeCollection;
  }
}
