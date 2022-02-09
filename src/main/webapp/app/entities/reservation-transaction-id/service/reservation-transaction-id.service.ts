import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IReservationTransactionId, getReservationTransactionIdIdentifier } from '../reservation-transaction-id.model';

export type EntityResponseType = HttpResponse<IReservationTransactionId>;
export type EntityArrayResponseType = HttpResponse<IReservationTransactionId[]>;

@Injectable({ providedIn: 'root' })
export class ReservationTransactionIdService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/reservation-transaction-ids');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(reservationTransactionId: IReservationTransactionId): Observable<EntityResponseType> {
    return this.http.post<IReservationTransactionId>(this.resourceUrl, reservationTransactionId, { observe: 'response' });
  }

  update(reservationTransactionId: IReservationTransactionId): Observable<EntityResponseType> {
    return this.http.put<IReservationTransactionId>(
      `${this.resourceUrl}/${getReservationTransactionIdIdentifier(reservationTransactionId) as number}`,
      reservationTransactionId,
      { observe: 'response' }
    );
  }

  partialUpdate(reservationTransactionId: IReservationTransactionId): Observable<EntityResponseType> {
    return this.http.patch<IReservationTransactionId>(
      `${this.resourceUrl}/${getReservationTransactionIdIdentifier(reservationTransactionId) as number}`,
      reservationTransactionId,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IReservationTransactionId>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IReservationTransactionId[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addReservationTransactionIdToCollectionIfMissing(
    reservationTransactionIdCollection: IReservationTransactionId[],
    ...reservationTransactionIdsToCheck: (IReservationTransactionId | null | undefined)[]
  ): IReservationTransactionId[] {
    const reservationTransactionIds: IReservationTransactionId[] = reservationTransactionIdsToCheck.filter(isPresent);
    if (reservationTransactionIds.length > 0) {
      const reservationTransactionIdCollectionIdentifiers = reservationTransactionIdCollection.map(
        reservationTransactionIdItem => getReservationTransactionIdIdentifier(reservationTransactionIdItem)!
      );
      const reservationTransactionIdsToAdd = reservationTransactionIds.filter(reservationTransactionIdItem => {
        const reservationTransactionIdIdentifier = getReservationTransactionIdIdentifier(reservationTransactionIdItem);
        if (
          reservationTransactionIdIdentifier == null ||
          reservationTransactionIdCollectionIdentifiers.includes(reservationTransactionIdIdentifier)
        ) {
          return false;
        }
        reservationTransactionIdCollectionIdentifiers.push(reservationTransactionIdIdentifier);
        return true;
      });
      return [...reservationTransactionIdsToAdd, ...reservationTransactionIdCollection];
    }
    return reservationTransactionIdCollection;
  }
}
