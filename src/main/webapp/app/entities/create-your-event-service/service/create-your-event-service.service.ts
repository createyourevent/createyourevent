import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICreateYourEventService, getCreateYourEventServiceIdentifier } from '../create-your-event-service.model';

export type EntityResponseType = HttpResponse<ICreateYourEventService>;
export type EntityArrayResponseType = HttpResponse<ICreateYourEventService[]>;

@Injectable({ providedIn: 'root' })
export class CreateYourEventServiceService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/create-your-event-services');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(createYourEventService: ICreateYourEventService): Observable<EntityResponseType> {
    return this.http.post<ICreateYourEventService>(this.resourceUrl, createYourEventService, { observe: 'response' });
  }

  update(createYourEventService: ICreateYourEventService): Observable<EntityResponseType> {
    return this.http.put<ICreateYourEventService>(
      `${this.resourceUrl}/${getCreateYourEventServiceIdentifier(createYourEventService) as number}`,
      createYourEventService,
      { observe: 'response' }
    );
  }

  partialUpdate(createYourEventService: ICreateYourEventService): Observable<EntityResponseType> {
    return this.http.patch<ICreateYourEventService>(
      `${this.resourceUrl}/${getCreateYourEventServiceIdentifier(createYourEventService) as number}`,
      createYourEventService,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICreateYourEventService>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICreateYourEventService[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addCreateYourEventServiceToCollectionIfMissing(
    createYourEventServiceCollection: ICreateYourEventService[],
    ...createYourEventServicesToCheck: (ICreateYourEventService | null | undefined)[]
  ): ICreateYourEventService[] {
    const createYourEventServices: ICreateYourEventService[] = createYourEventServicesToCheck.filter(isPresent);
    if (createYourEventServices.length > 0) {
      const createYourEventServiceCollectionIdentifiers = createYourEventServiceCollection.map(
        createYourEventServiceItem => getCreateYourEventServiceIdentifier(createYourEventServiceItem)!
      );
      const createYourEventServicesToAdd = createYourEventServices.filter(createYourEventServiceItem => {
        const createYourEventServiceIdentifier = getCreateYourEventServiceIdentifier(createYourEventServiceItem);
        if (
          createYourEventServiceIdentifier == null ||
          createYourEventServiceCollectionIdentifiers.includes(createYourEventServiceIdentifier)
        ) {
          return false;
        }
        createYourEventServiceCollectionIdentifiers.push(createYourEventServiceIdentifier);
        return true;
      });
      return [...createYourEventServicesToAdd, ...createYourEventServiceCollection];
    }
    return createYourEventServiceCollection;
  }
}
