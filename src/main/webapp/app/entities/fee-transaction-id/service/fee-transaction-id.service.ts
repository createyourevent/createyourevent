import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFeeTransactionId, getFeeTransactionIdIdentifier } from '../fee-transaction-id.model';

export type EntityResponseType = HttpResponse<IFeeTransactionId>;
export type EntityArrayResponseType = HttpResponse<IFeeTransactionId[]>;

@Injectable({ providedIn: 'root' })
export class FeeTransactionIdService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/fee-transaction-ids');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(feeTransactionId: IFeeTransactionId): Observable<EntityResponseType> {
    return this.http.post<IFeeTransactionId>(this.resourceUrl, feeTransactionId, { observe: 'response' });
  }

  update(feeTransactionId: IFeeTransactionId): Observable<EntityResponseType> {
    return this.http.put<IFeeTransactionId>(
      `${this.resourceUrl}/${getFeeTransactionIdIdentifier(feeTransactionId) as number}`,
      feeTransactionId,
      { observe: 'response' }
    );
  }

  partialUpdate(feeTransactionId: IFeeTransactionId): Observable<EntityResponseType> {
    return this.http.patch<IFeeTransactionId>(
      `${this.resourceUrl}/${getFeeTransactionIdIdentifier(feeTransactionId) as number}`,
      feeTransactionId,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IFeeTransactionId>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IFeeTransactionId[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addFeeTransactionIdToCollectionIfMissing(
    feeTransactionIdCollection: IFeeTransactionId[],
    ...feeTransactionIdsToCheck: (IFeeTransactionId | null | undefined)[]
  ): IFeeTransactionId[] {
    const feeTransactionIds: IFeeTransactionId[] = feeTransactionIdsToCheck.filter(isPresent);
    if (feeTransactionIds.length > 0) {
      const feeTransactionIdCollectionIdentifiers = feeTransactionIdCollection.map(
        feeTransactionIdItem => getFeeTransactionIdIdentifier(feeTransactionIdItem)!
      );
      const feeTransactionIdsToAdd = feeTransactionIds.filter(feeTransactionIdItem => {
        const feeTransactionIdIdentifier = getFeeTransactionIdIdentifier(feeTransactionIdItem);
        if (feeTransactionIdIdentifier == null || feeTransactionIdCollectionIdentifiers.includes(feeTransactionIdIdentifier)) {
          return false;
        }
        feeTransactionIdCollectionIdentifiers.push(feeTransactionIdIdentifier);
        return true;
      });
      return [...feeTransactionIdsToAdd, ...feeTransactionIdCollection];
    }
    return feeTransactionIdCollection;
  }
}
