import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAdminFeesPrice, getAdminFeesPriceIdentifier } from '../admin-fees-price.model';

export type EntityResponseType = HttpResponse<IAdminFeesPrice>;
export type EntityArrayResponseType = HttpResponse<IAdminFeesPrice[]>;

@Injectable({ providedIn: 'root' })
export class AdminFeesPriceService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/admin-fees-prices');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(adminFeesPrice: IAdminFeesPrice): Observable<EntityResponseType> {
    return this.http.post<IAdminFeesPrice>(this.resourceUrl, adminFeesPrice, { observe: 'response' });
  }

  update(adminFeesPrice: IAdminFeesPrice): Observable<EntityResponseType> {
    return this.http.put<IAdminFeesPrice>(`${this.resourceUrl}/${getAdminFeesPriceIdentifier(adminFeesPrice) as number}`, adminFeesPrice, {
      observe: 'response',
    });
  }

  partialUpdate(adminFeesPrice: IAdminFeesPrice): Observable<EntityResponseType> {
    return this.http.patch<IAdminFeesPrice>(
      `${this.resourceUrl}/${getAdminFeesPriceIdentifier(adminFeesPrice) as number}`,
      adminFeesPrice,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAdminFeesPrice>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAdminFeesPrice[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAdminFeesPriceToCollectionIfMissing(
    adminFeesPriceCollection: IAdminFeesPrice[],
    ...adminFeesPricesToCheck: (IAdminFeesPrice | null | undefined)[]
  ): IAdminFeesPrice[] {
    const adminFeesPrices: IAdminFeesPrice[] = adminFeesPricesToCheck.filter(isPresent);
    if (adminFeesPrices.length > 0) {
      const adminFeesPriceCollectionIdentifiers = adminFeesPriceCollection.map(
        adminFeesPriceItem => getAdminFeesPriceIdentifier(adminFeesPriceItem)!
      );
      const adminFeesPricesToAdd = adminFeesPrices.filter(adminFeesPriceItem => {
        const adminFeesPriceIdentifier = getAdminFeesPriceIdentifier(adminFeesPriceItem);
        if (adminFeesPriceIdentifier == null || adminFeesPriceCollectionIdentifiers.includes(adminFeesPriceIdentifier)) {
          return false;
        }
        adminFeesPriceCollectionIdentifiers.push(adminFeesPriceIdentifier);
        return true;
      });
      return [...adminFeesPricesToAdd, ...adminFeesPriceCollection];
    }
    return adminFeesPriceCollection;
  }
}
