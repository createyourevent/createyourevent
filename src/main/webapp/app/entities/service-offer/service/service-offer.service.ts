import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IServiceOffer, getServiceOfferIdentifier } from '../service-offer.model';

export type EntityResponseType = HttpResponse<IServiceOffer>;
export type EntityArrayResponseType = HttpResponse<IServiceOffer[]>;

@Injectable({ providedIn: 'root' })
export class ServiceOfferService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/service-offers');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(serviceOffer: IServiceOffer): Observable<EntityResponseType> {
    return this.http.post<IServiceOffer>(this.resourceUrl, serviceOffer, { observe: 'response' });
  }

  update(serviceOffer: IServiceOffer): Observable<EntityResponseType> {
    return this.http.put<IServiceOffer>(`${this.resourceUrl}/${getServiceOfferIdentifier(serviceOffer) as number}`, serviceOffer, {
      observe: 'response',
    });
  }

  partialUpdate(serviceOffer: IServiceOffer): Observable<EntityResponseType> {
    return this.http.patch<IServiceOffer>(`${this.resourceUrl}/${getServiceOfferIdentifier(serviceOffer) as number}`, serviceOffer, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IServiceOffer>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IServiceOffer[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addServiceOfferToCollectionIfMissing(
    serviceOfferCollection: IServiceOffer[],
    ...serviceOffersToCheck: (IServiceOffer | null | undefined)[]
  ): IServiceOffer[] {
    const serviceOffers: IServiceOffer[] = serviceOffersToCheck.filter(isPresent);
    if (serviceOffers.length > 0) {
      const serviceOfferCollectionIdentifiers = serviceOfferCollection.map(
        serviceOfferItem => getServiceOfferIdentifier(serviceOfferItem)!
      );
      const serviceOffersToAdd = serviceOffers.filter(serviceOfferItem => {
        const serviceOfferIdentifier = getServiceOfferIdentifier(serviceOfferItem);
        if (serviceOfferIdentifier == null || serviceOfferCollectionIdentifiers.includes(serviceOfferIdentifier)) {
          return false;
        }
        serviceOfferCollectionIdentifiers.push(serviceOfferIdentifier);
        return true;
      });
      return [...serviceOffersToAdd, ...serviceOfferCollection];
    }
    return serviceOfferCollection;
  }
}
