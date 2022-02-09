import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IHotel, getHotelIdentifier } from '../hotel.model';

export type EntityResponseType = HttpResponse<IHotel>;
export type EntityArrayResponseType = HttpResponse<IHotel[]>;

@Injectable({ providedIn: 'root' })
export class HotelService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/hotels');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(hotel: IHotel): Observable<EntityResponseType> {
    return this.http.post<IHotel>(this.resourceUrl, hotel, { observe: 'response' });
  }

  update(hotel: IHotel): Observable<EntityResponseType> {
    return this.http.put<IHotel>(`${this.resourceUrl}/${getHotelIdentifier(hotel) as number}`, hotel, { observe: 'response' });
  }

  partialUpdate(hotel: IHotel): Observable<EntityResponseType> {
    return this.http.patch<IHotel>(`${this.resourceUrl}/${getHotelIdentifier(hotel) as number}`, hotel, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IHotel>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IHotel[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addHotelToCollectionIfMissing(hotelCollection: IHotel[], ...hotelsToCheck: (IHotel | null | undefined)[]): IHotel[] {
    const hotels: IHotel[] = hotelsToCheck.filter(isPresent);
    if (hotels.length > 0) {
      const hotelCollectionIdentifiers = hotelCollection.map(hotelItem => getHotelIdentifier(hotelItem)!);
      const hotelsToAdd = hotels.filter(hotelItem => {
        const hotelIdentifier = getHotelIdentifier(hotelItem);
        if (hotelIdentifier == null || hotelCollectionIdentifiers.includes(hotelIdentifier)) {
          return false;
        }
        hotelCollectionIdentifiers.push(hotelIdentifier);
        return true;
      });
      return [...hotelsToAdd, ...hotelCollection];
    }
    return hotelCollection;
  }
}
