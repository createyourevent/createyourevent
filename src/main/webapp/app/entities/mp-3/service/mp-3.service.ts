import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMp3, getMp3Identifier } from '../mp-3.model';

export type EntityResponseType = HttpResponse<IMp3>;
export type EntityArrayResponseType = HttpResponse<IMp3[]>;

@Injectable({ providedIn: 'root' })
export class Mp3Service {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/mp-3-s');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(mp3: IMp3): Observable<EntityResponseType> {
    return this.http.post<IMp3>(this.resourceUrl, mp3, { observe: 'response' });
  }

  update(mp3: IMp3): Observable<EntityResponseType> {
    return this.http.put<IMp3>(`${this.resourceUrl}/${getMp3Identifier(mp3) as number}`, mp3, { observe: 'response' });
  }

  partialUpdate(mp3: IMp3): Observable<EntityResponseType> {
    return this.http.patch<IMp3>(`${this.resourceUrl}/${getMp3Identifier(mp3) as number}`, mp3, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IMp3>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IMp3[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addMp3ToCollectionIfMissing(mp3Collection: IMp3[], ...mp3sToCheck: (IMp3 | null | undefined)[]): IMp3[] {
    const mp3s: IMp3[] = mp3sToCheck.filter(isPresent);
    if (mp3s.length > 0) {
      const mp3CollectionIdentifiers = mp3Collection.map(mp3Item => getMp3Identifier(mp3Item)!);
      const mp3sToAdd = mp3s.filter(mp3Item => {
        const mp3Identifier = getMp3Identifier(mp3Item);
        if (mp3Identifier == null || mp3CollectionIdentifiers.includes(mp3Identifier)) {
          return false;
        }
        mp3CollectionIdentifiers.push(mp3Identifier);
        return true;
      });
      return [...mp3sToAdd, ...mp3Collection];
    }
    return mp3Collection;
  }
}
