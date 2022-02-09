import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEventDetails, getEventDetailsIdentifier } from '../event-details.model';

export type EntityResponseType = HttpResponse<IEventDetails>;
export type EntityArrayResponseType = HttpResponse<IEventDetails[]>;

@Injectable({ providedIn: 'root' })
export class EventDetailsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/event-details');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(eventDetails: IEventDetails): Observable<EntityResponseType> {
    return this.http.post<IEventDetails>(this.resourceUrl, eventDetails, { observe: 'response' });
  }

  update(eventDetails: IEventDetails): Observable<EntityResponseType> {
    return this.http.put<IEventDetails>(`${this.resourceUrl}/${getEventDetailsIdentifier(eventDetails) as number}`, eventDetails, {
      observe: 'response',
    });
  }

  partialUpdate(eventDetails: IEventDetails): Observable<EntityResponseType> {
    return this.http.patch<IEventDetails>(`${this.resourceUrl}/${getEventDetailsIdentifier(eventDetails) as number}`, eventDetails, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IEventDetails>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEventDetails[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addEventDetailsToCollectionIfMissing(
    eventDetailsCollection: IEventDetails[],
    ...eventDetailsToCheck: (IEventDetails | null | undefined)[]
  ): IEventDetails[] {
    const eventDetails: IEventDetails[] = eventDetailsToCheck.filter(isPresent);
    if (eventDetails.length > 0) {
      const eventDetailsCollectionIdentifiers = eventDetailsCollection.map(
        eventDetailsItem => getEventDetailsIdentifier(eventDetailsItem)!
      );
      const eventDetailsToAdd = eventDetails.filter(eventDetailsItem => {
        const eventDetailsIdentifier = getEventDetailsIdentifier(eventDetailsItem);
        if (eventDetailsIdentifier == null || eventDetailsCollectionIdentifiers.includes(eventDetailsIdentifier)) {
          return false;
        }
        eventDetailsCollectionIdentifiers.push(eventDetailsIdentifier);
        return true;
      });
      return [...eventDetailsToAdd, ...eventDetailsCollection];
    }
    return eventDetailsCollection;
  }
}
