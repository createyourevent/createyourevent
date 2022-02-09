import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBond, getBondIdentifier } from '../bond.model';

export type EntityResponseType = HttpResponse<IBond>;
export type EntityArrayResponseType = HttpResponse<IBond[]>;

@Injectable({ providedIn: 'root' })
export class BondService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/bonds');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(bond: IBond): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(bond);
    return this.http
      .post<IBond>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(bond: IBond): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(bond);
    return this.http
      .put<IBond>(`${this.resourceUrl}/${getBondIdentifier(bond) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(bond: IBond): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(bond);
    return this.http
      .patch<IBond>(`${this.resourceUrl}/${getBondIdentifier(bond) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IBond>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IBond[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addBondToCollectionIfMissing(bondCollection: IBond[], ...bondsToCheck: (IBond | null | undefined)[]): IBond[] {
    const bonds: IBond[] = bondsToCheck.filter(isPresent);
    if (bonds.length > 0) {
      const bondCollectionIdentifiers = bondCollection.map(bondItem => getBondIdentifier(bondItem)!);
      const bondsToAdd = bonds.filter(bondItem => {
        const bondIdentifier = getBondIdentifier(bondItem);
        if (bondIdentifier == null || bondCollectionIdentifiers.includes(bondIdentifier)) {
          return false;
        }
        bondCollectionIdentifiers.push(bondIdentifier);
        return true;
      });
      return [...bondsToAdd, ...bondCollection];
    }
    return bondCollection;
  }

  protected convertDateFromClient(bond: IBond): IBond {
    return Object.assign({}, bond, {
      creationDate: bond.creationDate?.isValid() ? bond.creationDate.toJSON() : undefined,
      redemptionDate: bond.redemptionDate?.isValid() ? bond.redemptionDate.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.creationDate = res.body.creationDate ? dayjs(res.body.creationDate) : undefined;
      res.body.redemptionDate = res.body.redemptionDate ? dayjs(res.body.redemptionDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((bond: IBond) => {
        bond.creationDate = bond.creationDate ? dayjs(bond.creationDate) : undefined;
        bond.redemptionDate = bond.redemptionDate ? dayjs(bond.redemptionDate) : undefined;
      });
    }
    return res;
  }
}
