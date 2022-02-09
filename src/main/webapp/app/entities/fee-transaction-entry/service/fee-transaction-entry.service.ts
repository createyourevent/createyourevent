import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFeeTransactionEntry, getFeeTransactionEntryIdentifier } from '../fee-transaction-entry.model';

export type EntityResponseType = HttpResponse<IFeeTransactionEntry>;
export type EntityArrayResponseType = HttpResponse<IFeeTransactionEntry[]>;

@Injectable({ providedIn: 'root' })
export class FeeTransactionEntryService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/fee-transaction-entries');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(feeTransactionEntry: IFeeTransactionEntry): Observable<EntityResponseType> {
    return this.http.post<IFeeTransactionEntry>(this.resourceUrl, feeTransactionEntry, { observe: 'response' });
  }

  update(feeTransactionEntry: IFeeTransactionEntry): Observable<EntityResponseType> {
    return this.http.put<IFeeTransactionEntry>(
      `${this.resourceUrl}/${getFeeTransactionEntryIdentifier(feeTransactionEntry) as number}`,
      feeTransactionEntry,
      { observe: 'response' }
    );
  }

  partialUpdate(feeTransactionEntry: IFeeTransactionEntry): Observable<EntityResponseType> {
    return this.http.patch<IFeeTransactionEntry>(
      `${this.resourceUrl}/${getFeeTransactionEntryIdentifier(feeTransactionEntry) as number}`,
      feeTransactionEntry,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IFeeTransactionEntry>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IFeeTransactionEntry[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addFeeTransactionEntryToCollectionIfMissing(
    feeTransactionEntryCollection: IFeeTransactionEntry[],
    ...feeTransactionEntriesToCheck: (IFeeTransactionEntry | null | undefined)[]
  ): IFeeTransactionEntry[] {
    const feeTransactionEntries: IFeeTransactionEntry[] = feeTransactionEntriesToCheck.filter(isPresent);
    if (feeTransactionEntries.length > 0) {
      const feeTransactionEntryCollectionIdentifiers = feeTransactionEntryCollection.map(
        feeTransactionEntryItem => getFeeTransactionEntryIdentifier(feeTransactionEntryItem)!
      );
      const feeTransactionEntriesToAdd = feeTransactionEntries.filter(feeTransactionEntryItem => {
        const feeTransactionEntryIdentifier = getFeeTransactionEntryIdentifier(feeTransactionEntryItem);
        if (feeTransactionEntryIdentifier == null || feeTransactionEntryCollectionIdentifiers.includes(feeTransactionEntryIdentifier)) {
          return false;
        }
        feeTransactionEntryCollectionIdentifiers.push(feeTransactionEntryIdentifier);
        return true;
      });
      return [...feeTransactionEntriesToAdd, ...feeTransactionEntryCollection];
    }
    return feeTransactionEntryCollection;
  }
}
