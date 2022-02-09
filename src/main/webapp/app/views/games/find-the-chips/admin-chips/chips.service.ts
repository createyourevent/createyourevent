import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/core/request/request-util';
import { IChips } from 'app/entities/chips/chips.model';


type EntityResponseType = HttpResponse<IChips>;
type EntityArrayResponseType = HttpResponse<IChips[]>;

@Injectable({ providedIn: 'root' })
export class ChipsService {
  public resourceUrl = SERVER_API_URL + 'api/chips';

  constructor(protected http: HttpClient) {}

  create(chips: IChips): Observable<EntityResponseType> {
    return this.http.post<IChips>(this.resourceUrl, chips, { observe: 'response' });
  }

  update(chips: IChips): Observable<EntityResponseType> {
    return this.http.put<IChips>(this.resourceUrl, chips, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IChips>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IChips[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
