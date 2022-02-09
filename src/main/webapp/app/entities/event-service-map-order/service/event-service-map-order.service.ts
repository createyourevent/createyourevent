import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEventServiceMapOrder, getEventServiceMapOrderIdentifier } from '../event-service-map-order.model';

export type EntityResponseType = HttpResponse<IEventServiceMapOrder>;
export type EntityArrayResponseType = HttpResponse<IEventServiceMapOrder[]>;

@Injectable({ providedIn: 'root' })
export class EventServiceMapOrderService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/event-service-map-orders');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(eventServiceMapOrder: IEventServiceMapOrder): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(eventServiceMapOrder);
    return this.http
      .post<IEventServiceMapOrder>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(eventServiceMapOrder: IEventServiceMapOrder): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(eventServiceMapOrder);
    return this.http
      .put<IEventServiceMapOrder>(`${this.resourceUrl}/${getEventServiceMapOrderIdentifier(eventServiceMapOrder) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(eventServiceMapOrder: IEventServiceMapOrder): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(eventServiceMapOrder);
    return this.http
      .patch<IEventServiceMapOrder>(`${this.resourceUrl}/${getEventServiceMapOrderIdentifier(eventServiceMapOrder) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IEventServiceMapOrder>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IEventServiceMapOrder[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addEventServiceMapOrderToCollectionIfMissing(
    eventServiceMapOrderCollection: IEventServiceMapOrder[],
    ...eventServiceMapOrdersToCheck: (IEventServiceMapOrder | null | undefined)[]
  ): IEventServiceMapOrder[] {
    const eventServiceMapOrders: IEventServiceMapOrder[] = eventServiceMapOrdersToCheck.filter(isPresent);
    if (eventServiceMapOrders.length > 0) {
      const eventServiceMapOrderCollectionIdentifiers = eventServiceMapOrderCollection.map(
        eventServiceMapOrderItem => getEventServiceMapOrderIdentifier(eventServiceMapOrderItem)!
      );
      const eventServiceMapOrdersToAdd = eventServiceMapOrders.filter(eventServiceMapOrderItem => {
        const eventServiceMapOrderIdentifier = getEventServiceMapOrderIdentifier(eventServiceMapOrderItem);
        if (eventServiceMapOrderIdentifier == null || eventServiceMapOrderCollectionIdentifiers.includes(eventServiceMapOrderIdentifier)) {
          return false;
        }
        eventServiceMapOrderCollectionIdentifiers.push(eventServiceMapOrderIdentifier);
        return true;
      });
      return [...eventServiceMapOrdersToAdd, ...eventServiceMapOrderCollection];
    }
    return eventServiceMapOrderCollection;
  }

  protected convertDateFromClient(eventServiceMapOrder: IEventServiceMapOrder): IEventServiceMapOrder {
    return Object.assign({}, eventServiceMapOrder, {
      date: eventServiceMapOrder.date?.isValid() ? eventServiceMapOrder.date.toJSON() : undefined,
      dateFrom: eventServiceMapOrder.dateFrom?.isValid() ? eventServiceMapOrder.dateFrom.toJSON() : undefined,
      dateUntil: eventServiceMapOrder.dateUntil?.isValid() ? eventServiceMapOrder.dateUntil.toJSON() : undefined,
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
      res.body.forEach((eventServiceMapOrder: IEventServiceMapOrder) => {
        eventServiceMapOrder.date = eventServiceMapOrder.date ? dayjs(eventServiceMapOrder.date) : undefined;
        eventServiceMapOrder.dateFrom = eventServiceMapOrder.dateFrom ? dayjs(eventServiceMapOrder.dateFrom) : undefined;
        eventServiceMapOrder.dateUntil = eventServiceMapOrder.dateUntil ? dayjs(eventServiceMapOrder.dateUntil) : undefined;
      });
    }
    return res;
  }
}
