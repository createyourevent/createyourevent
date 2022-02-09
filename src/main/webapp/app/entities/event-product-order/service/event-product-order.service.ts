import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEventProductOrder, getEventProductOrderIdentifier } from '../event-product-order.model';

export type EntityResponseType = HttpResponse<IEventProductOrder>;
export type EntityArrayResponseType = HttpResponse<IEventProductOrder[]>;

@Injectable({ providedIn: 'root' })
export class EventProductOrderService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/event-product-orders');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(eventProductOrder: IEventProductOrder): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(eventProductOrder);
    return this.http
      .post<IEventProductOrder>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(eventProductOrder: IEventProductOrder): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(eventProductOrder);
    return this.http
      .put<IEventProductOrder>(`${this.resourceUrl}/${getEventProductOrderIdentifier(eventProductOrder) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(eventProductOrder: IEventProductOrder): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(eventProductOrder);
    return this.http
      .patch<IEventProductOrder>(`${this.resourceUrl}/${getEventProductOrderIdentifier(eventProductOrder) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IEventProductOrder>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IEventProductOrder[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addEventProductOrderToCollectionIfMissing(
    eventProductOrderCollection: IEventProductOrder[],
    ...eventProductOrdersToCheck: (IEventProductOrder | null | undefined)[]
  ): IEventProductOrder[] {
    const eventProductOrders: IEventProductOrder[] = eventProductOrdersToCheck.filter(isPresent);
    if (eventProductOrders.length > 0) {
      const eventProductOrderCollectionIdentifiers = eventProductOrderCollection.map(
        eventProductOrderItem => getEventProductOrderIdentifier(eventProductOrderItem)!
      );
      const eventProductOrdersToAdd = eventProductOrders.filter(eventProductOrderItem => {
        const eventProductOrderIdentifier = getEventProductOrderIdentifier(eventProductOrderItem);
        if (eventProductOrderIdentifier == null || eventProductOrderCollectionIdentifiers.includes(eventProductOrderIdentifier)) {
          return false;
        }
        eventProductOrderCollectionIdentifiers.push(eventProductOrderIdentifier);
        return true;
      });
      return [...eventProductOrdersToAdd, ...eventProductOrderCollection];
    }
    return eventProductOrderCollection;
  }

  protected convertDateFromClient(eventProductOrder: IEventProductOrder): IEventProductOrder {
    return Object.assign({}, eventProductOrder, {
      date: eventProductOrder.date?.isValid() ? eventProductOrder.date.toJSON() : undefined,
      dateFrom: eventProductOrder.dateFrom?.isValid() ? eventProductOrder.dateFrom.toJSON() : undefined,
      dateUntil: eventProductOrder.dateUntil?.isValid() ? eventProductOrder.dateUntil.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.date = res.body.date ? dayjs(res.body.date) : undefined;
      res.body.dateFrom = res.body.dateFrom ? dayjs(res.body.dateFrom) : undefined;
      res.body.dateUntil = res.body.dateUntil ? dayjs(res.body.dateUntil) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((eventProductOrder: IEventProductOrder) => {
        eventProductOrder.date = eventProductOrder.date ? dayjs(eventProductOrder.date) : undefined;
        eventProductOrder.dateFrom = eventProductOrder.dateFrom ? dayjs(eventProductOrder.dateFrom) : undefined;
        eventProductOrder.dateUntil = eventProductOrder.dateUntil ? dayjs(eventProductOrder.dateUntil) : undefined;
      });
    }
    return res;
  }
}
