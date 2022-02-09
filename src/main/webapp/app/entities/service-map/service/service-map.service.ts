import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IServiceMap, getServiceMapIdentifier } from '../service-map.model';

export type EntityResponseType = HttpResponse<IServiceMap>;
export type EntityArrayResponseType = HttpResponse<IServiceMap[]>;

@Injectable({ providedIn: 'root' })
export class ServiceMapService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/service-maps');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(serviceMap: IServiceMap): Observable<EntityResponseType> {
    return this.http.post<IServiceMap>(this.resourceUrl, serviceMap, { observe: 'response' });
  }

  update(serviceMap: IServiceMap): Observable<EntityResponseType> {
    return this.http.put<IServiceMap>(`${this.resourceUrl}/${getServiceMapIdentifier(serviceMap) as number}`, serviceMap, {
      observe: 'response',
    });
  }

  partialUpdate(serviceMap: IServiceMap): Observable<EntityResponseType> {
    return this.http.patch<IServiceMap>(`${this.resourceUrl}/${getServiceMapIdentifier(serviceMap) as number}`, serviceMap, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IServiceMap>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IServiceMap[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addServiceMapToCollectionIfMissing(
    serviceMapCollection: IServiceMap[],
    ...serviceMapsToCheck: (IServiceMap | null | undefined)[]
  ): IServiceMap[] {
    const serviceMaps: IServiceMap[] = serviceMapsToCheck.filter(isPresent);
    if (serviceMaps.length > 0) {
      const serviceMapCollectionIdentifiers = serviceMapCollection.map(serviceMapItem => getServiceMapIdentifier(serviceMapItem)!);
      const serviceMapsToAdd = serviceMaps.filter(serviceMapItem => {
        const serviceMapIdentifier = getServiceMapIdentifier(serviceMapItem);
        if (serviceMapIdentifier == null || serviceMapCollectionIdentifiers.includes(serviceMapIdentifier)) {
          return false;
        }
        serviceMapCollectionIdentifiers.push(serviceMapIdentifier);
        return true;
      });
      return [...serviceMapsToAdd, ...serviceMapCollection];
    }
    return serviceMapCollection;
  }
}
