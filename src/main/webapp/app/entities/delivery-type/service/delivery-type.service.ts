import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDeliveryType, getDeliveryTypeIdentifier } from '../delivery-type.model';

export type EntityResponseType = HttpResponse<IDeliveryType>;
export type EntityArrayResponseType = HttpResponse<IDeliveryType[]>;

@Injectable({ providedIn: 'root' })
export class DeliveryTypeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/delivery-types');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(deliveryType: IDeliveryType): Observable<EntityResponseType> {
    return this.http.post<IDeliveryType>(this.resourceUrl, deliveryType, { observe: 'response' });
  }

  update(deliveryType: IDeliveryType): Observable<EntityResponseType> {
    return this.http.put<IDeliveryType>(`${this.resourceUrl}/${getDeliveryTypeIdentifier(deliveryType) as number}`, deliveryType, {
      observe: 'response',
    });
  }

  partialUpdate(deliveryType: IDeliveryType): Observable<EntityResponseType> {
    return this.http.patch<IDeliveryType>(`${this.resourceUrl}/${getDeliveryTypeIdentifier(deliveryType) as number}`, deliveryType, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IDeliveryType>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IDeliveryType[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addDeliveryTypeToCollectionIfMissing(
    deliveryTypeCollection: IDeliveryType[],
    ...deliveryTypesToCheck: (IDeliveryType | null | undefined)[]
  ): IDeliveryType[] {
    const deliveryTypes: IDeliveryType[] = deliveryTypesToCheck.filter(isPresent);
    if (deliveryTypes.length > 0) {
      const deliveryTypeCollectionIdentifiers = deliveryTypeCollection.map(
        deliveryTypeItem => getDeliveryTypeIdentifier(deliveryTypeItem)!
      );
      const deliveryTypesToAdd = deliveryTypes.filter(deliveryTypeItem => {
        const deliveryTypeIdentifier = getDeliveryTypeIdentifier(deliveryTypeItem);
        if (deliveryTypeIdentifier == null || deliveryTypeCollectionIdentifiers.includes(deliveryTypeIdentifier)) {
          return false;
        }
        deliveryTypeCollectionIdentifiers.push(deliveryTypeIdentifier);
        return true;
      });
      return [...deliveryTypesToAdd, ...deliveryTypeCollection];
    }
    return deliveryTypeCollection;
  }
}
