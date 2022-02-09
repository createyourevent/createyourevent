import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IUserExtension, getUserExtensionIdentifier } from '../user-extension.model';

export type EntityResponseType = HttpResponse<IUserExtension>;
export type EntityArrayResponseType = HttpResponse<IUserExtension[]>;

@Injectable({ providedIn: 'root' })
export class UserExtensionService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/user-extensions');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(userExtension: IUserExtension): Observable<EntityResponseType> {
    return this.http.post<IUserExtension>(this.resourceUrl, userExtension, { observe: 'response' });
  }

  update(userExtension: IUserExtension): Observable<EntityResponseType> {
    return this.http.put<IUserExtension>(`${this.resourceUrl}/${getUserExtensionIdentifier(userExtension) as number}`, userExtension, {
      observe: 'response',
    });
  }

  partialUpdate(userExtension: IUserExtension): Observable<EntityResponseType> {
    return this.http.patch<IUserExtension>(`${this.resourceUrl}/${getUserExtensionIdentifier(userExtension) as number}`, userExtension, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IUserExtension>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IUserExtension[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addUserExtensionToCollectionIfMissing(
    userExtensionCollection: IUserExtension[],
    ...userExtensionsToCheck: (IUserExtension | null | undefined)[]
  ): IUserExtension[] {
    const userExtensions: IUserExtension[] = userExtensionsToCheck.filter(isPresent);
    if (userExtensions.length > 0) {
      const userExtensionCollectionIdentifiers = userExtensionCollection.map(
        userExtensionItem => getUserExtensionIdentifier(userExtensionItem)!
      );
      const userExtensionsToAdd = userExtensions.filter(userExtensionItem => {
        const userExtensionIdentifier = getUserExtensionIdentifier(userExtensionItem);
        if (userExtensionIdentifier == null || userExtensionCollectionIdentifiers.includes(userExtensionIdentifier)) {
          return false;
        }
        userExtensionCollectionIdentifiers.push(userExtensionIdentifier);
        return true;
      });
      return [...userExtensionsToAdd, ...userExtensionCollection];
    }
    return userExtensionCollection;
  }
}
