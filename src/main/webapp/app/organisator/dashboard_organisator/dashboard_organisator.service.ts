import { HttpResponse, HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SERVER_API_URL } from "app/app.constants";
import { createRequestOption } from "app/core/request/request-util";
import { IEvent } from "app/entities/event/event.model";
import { Observable } from "rxjs";


type EntityResponseType = HttpResponse<IEvent>;
type EntityArrayResponseType = HttpResponse<IEvent[]>;

@Injectable({
  providedIn: 'root'
})
export class OrganisatorDashboardService {
  public resourceUrl = SERVER_API_URL + 'api/events';

  constructor(protected http: HttpClient) {}

  queryByUserAndActive(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEvent[]>(this.resourceUrl + '/user/active', { params: options, observe: 'response' });
  }
}
