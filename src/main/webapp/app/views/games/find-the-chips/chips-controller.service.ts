import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/core/request/request-util';
import { IChips } from 'app/entities/chips/chips.model';

type EntityArrayResponseType = HttpResponse<IChips[]>;

@Injectable({
  providedIn: 'root'
})
export class ChipsControllerService {

  public resourceUrl = SERVER_API_URL + 'api/chips';

  constructor(protected http: HttpClient) {}

  getAllChips(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IChips[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

}
