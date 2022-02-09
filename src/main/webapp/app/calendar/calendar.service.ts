import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/core/request/request-util';
import { IEvent } from 'app/entities/event/event.model';


type EntityResponseType = HttpResponse<IEvent>;
type EntityArrayResponseType = HttpResponse<IEvent[]>;

@Injectable({ providedIn: 'root' })
export class CalendarService {
  public resourceUrl = SERVER_API_URL + 'api/events';

  constructor(protected http: HttpClient) {}

  queryIsPublicAndActive(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEvent[]>(`${this.resourceUrl}/public/active`, { params: options, observe: 'response' });
  }
}
