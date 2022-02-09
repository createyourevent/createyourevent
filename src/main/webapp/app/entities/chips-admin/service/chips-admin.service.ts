import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IChipsAdmin, getChipsAdminIdentifier } from '../chips-admin.model';

export type EntityResponseType = HttpResponse<IChipsAdmin>;
export type EntityArrayResponseType = HttpResponse<IChipsAdmin[]>;

@Injectable({ providedIn: 'root' })
export class ChipsAdminService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/chips-admins');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(chipsAdmin: IChipsAdmin): Observable<EntityResponseType> {
    return this.http.post<IChipsAdmin>(this.resourceUrl, chipsAdmin, { observe: 'response' });
  }

  update(chipsAdmin: IChipsAdmin): Observable<EntityResponseType> {
    return this.http.put<IChipsAdmin>(`${this.resourceUrl}/${getChipsAdminIdentifier(chipsAdmin) as number}`, chipsAdmin, {
      observe: 'response',
    });
  }

  partialUpdate(chipsAdmin: IChipsAdmin): Observable<EntityResponseType> {
    return this.http.patch<IChipsAdmin>(`${this.resourceUrl}/${getChipsAdminIdentifier(chipsAdmin) as number}`, chipsAdmin, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IChipsAdmin>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IChipsAdmin[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addChipsAdminToCollectionIfMissing(
    chipsAdminCollection: IChipsAdmin[],
    ...chipsAdminsToCheck: (IChipsAdmin | null | undefined)[]
  ): IChipsAdmin[] {
    const chipsAdmins: IChipsAdmin[] = chipsAdminsToCheck.filter(isPresent);
    if (chipsAdmins.length > 0) {
      const chipsAdminCollectionIdentifiers = chipsAdminCollection.map(chipsAdminItem => getChipsAdminIdentifier(chipsAdminItem)!);
      const chipsAdminsToAdd = chipsAdmins.filter(chipsAdminItem => {
        const chipsAdminIdentifier = getChipsAdminIdentifier(chipsAdminItem);
        if (chipsAdminIdentifier == null || chipsAdminCollectionIdentifiers.includes(chipsAdminIdentifier)) {
          return false;
        }
        chipsAdminCollectionIdentifiers.push(chipsAdminIdentifier);
        return true;
      });
      return [...chipsAdminsToAdd, ...chipsAdminCollection];
    }
    return chipsAdminCollection;
  }
}
