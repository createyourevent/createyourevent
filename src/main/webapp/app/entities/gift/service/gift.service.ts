import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IGift, getGiftIdentifier } from '../gift.model';

export type EntityResponseType = HttpResponse<IGift>;
export type EntityArrayResponseType = HttpResponse<IGift[]>;

@Injectable({ providedIn: 'root' })
export class GiftService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/gifts');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(gift: IGift): Observable<EntityResponseType> {
    return this.http.post<IGift>(this.resourceUrl, gift, { observe: 'response' });
  }

  update(gift: IGift): Observable<EntityResponseType> {
    return this.http.put<IGift>(`${this.resourceUrl}/${getGiftIdentifier(gift) as number}`, gift, { observe: 'response' });
  }

  partialUpdate(gift: IGift): Observable<EntityResponseType> {
    return this.http.patch<IGift>(`${this.resourceUrl}/${getGiftIdentifier(gift) as number}`, gift, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IGift>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IGift[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addGiftToCollectionIfMissing(giftCollection: IGift[], ...giftsToCheck: (IGift | null | undefined)[]): IGift[] {
    const gifts: IGift[] = giftsToCheck.filter(isPresent);
    if (gifts.length > 0) {
      const giftCollectionIdentifiers = giftCollection.map(giftItem => getGiftIdentifier(giftItem)!);
      const giftsToAdd = gifts.filter(giftItem => {
        const giftIdentifier = getGiftIdentifier(giftItem);
        if (giftIdentifier == null || giftCollectionIdentifiers.includes(giftIdentifier)) {
          return false;
        }
        giftCollectionIdentifiers.push(giftIdentifier);
        return true;
      });
      return [...giftsToAdd, ...giftCollection];
    }
    return giftCollection;
  }
}
