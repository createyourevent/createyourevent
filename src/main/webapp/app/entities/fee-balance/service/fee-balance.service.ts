import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFeeBalance, getFeeBalanceIdentifier } from '../fee-balance.model';

export type EntityResponseType = HttpResponse<IFeeBalance>;
export type EntityArrayResponseType = HttpResponse<IFeeBalance[]>;

@Injectable({ providedIn: 'root' })
export class FeeBalanceService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/fee-balances');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(feeBalance: IFeeBalance): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(feeBalance);
    return this.http
      .post<IFeeBalance>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(feeBalance: IFeeBalance): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(feeBalance);
    return this.http
      .put<IFeeBalance>(`${this.resourceUrl}/${getFeeBalanceIdentifier(feeBalance) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(feeBalance: IFeeBalance): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(feeBalance);
    return this.http
      .patch<IFeeBalance>(`${this.resourceUrl}/${getFeeBalanceIdentifier(feeBalance) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IFeeBalance>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IFeeBalance[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addFeeBalanceToCollectionIfMissing(
    feeBalanceCollection: IFeeBalance[],
    ...feeBalancesToCheck: (IFeeBalance | null | undefined)[]
  ): IFeeBalance[] {
    const feeBalances: IFeeBalance[] = feeBalancesToCheck.filter(isPresent);
    if (feeBalances.length > 0) {
      const feeBalanceCollectionIdentifiers = feeBalanceCollection.map(feeBalanceItem => getFeeBalanceIdentifier(feeBalanceItem)!);
      const feeBalancesToAdd = feeBalances.filter(feeBalanceItem => {
        const feeBalanceIdentifier = getFeeBalanceIdentifier(feeBalanceItem);
        if (feeBalanceIdentifier == null || feeBalanceCollectionIdentifiers.includes(feeBalanceIdentifier)) {
          return false;
        }
        feeBalanceCollectionIdentifiers.push(feeBalanceIdentifier);
        return true;
      });
      return [...feeBalancesToAdd, ...feeBalanceCollection];
    }
    return feeBalanceCollection;
  }

  protected convertDateFromClient(feeBalance: IFeeBalance): IFeeBalance {
    return Object.assign({}, feeBalance, {
      date: feeBalance.date?.isValid() ? feeBalance.date.toJSON() : undefined,
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
      res.body.forEach((feeBalance: IFeeBalance) => {
        feeBalance.date = feeBalance.date ? dayjs(feeBalance.date) : undefined;
      });
    }
    return res;
  }
}
