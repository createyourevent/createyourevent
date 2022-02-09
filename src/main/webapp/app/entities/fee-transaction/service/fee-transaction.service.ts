import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFeeTransaction, getFeeTransactionIdentifier } from '../fee-transaction.model';

export type EntityResponseType = HttpResponse<IFeeTransaction>;
export type EntityArrayResponseType = HttpResponse<IFeeTransaction[]>;

@Injectable({ providedIn: 'root' })
export class FeeTransactionService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/fee-transactions');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(feeTransaction: IFeeTransaction): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(feeTransaction);
    return this.http
      .post<IFeeTransaction>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(feeTransaction: IFeeTransaction): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(feeTransaction);
    return this.http
      .put<IFeeTransaction>(`${this.resourceUrl}/${getFeeTransactionIdentifier(feeTransaction) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(feeTransaction: IFeeTransaction): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(feeTransaction);
    return this.http
      .patch<IFeeTransaction>(`${this.resourceUrl}/${getFeeTransactionIdentifier(feeTransaction) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IFeeTransaction>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IFeeTransaction[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addFeeTransactionToCollectionIfMissing(
    feeTransactionCollection: IFeeTransaction[],
    ...feeTransactionsToCheck: (IFeeTransaction | null | undefined)[]
  ): IFeeTransaction[] {
    const feeTransactions: IFeeTransaction[] = feeTransactionsToCheck.filter(isPresent);
    if (feeTransactions.length > 0) {
      const feeTransactionCollectionIdentifiers = feeTransactionCollection.map(
        feeTransactionItem => getFeeTransactionIdentifier(feeTransactionItem)!
      );
      const feeTransactionsToAdd = feeTransactions.filter(feeTransactionItem => {
        const feeTransactionIdentifier = getFeeTransactionIdentifier(feeTransactionItem);
        if (feeTransactionIdentifier == null || feeTransactionCollectionIdentifiers.includes(feeTransactionIdentifier)) {
          return false;
        }
        feeTransactionCollectionIdentifiers.push(feeTransactionIdentifier);
        return true;
      });
      return [...feeTransactionsToAdd, ...feeTransactionCollection];
    }
    return feeTransactionCollection;
  }

  protected convertDateFromClient(feeTransaction: IFeeTransaction): IFeeTransaction {
    return Object.assign({}, feeTransaction, {
      date: feeTransaction.date?.isValid() ? feeTransaction.date.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.date = res.body.date ? dayjs(res.body.date) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((feeTransaction: IFeeTransaction) => {
        feeTransaction.date = feeTransaction.date ? dayjs(feeTransaction.date) : undefined;
      });
    }
    return res;
  }
}
