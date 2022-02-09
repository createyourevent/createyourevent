import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IOrganizationReservation, getOrganizationReservationIdentifier } from '../organization-reservation.model';

export type EntityResponseType = HttpResponse<IOrganizationReservation>;
export type EntityArrayResponseType = HttpResponse<IOrganizationReservation[]>;

@Injectable({ providedIn: 'root' })
export class OrganizationReservationService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/organization-reservations');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(organizationReservation: IOrganizationReservation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(organizationReservation);
    return this.http
      .post<IOrganizationReservation>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(organizationReservation: IOrganizationReservation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(organizationReservation);
    return this.http
      .put<IOrganizationReservation>(
        `${this.resourceUrl}/${getOrganizationReservationIdentifier(organizationReservation) as number}`,
        copy,
        { observe: 'response' }
      )
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(organizationReservation: IOrganizationReservation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(organizationReservation);
    return this.http
      .patch<IOrganizationReservation>(
        `${this.resourceUrl}/${getOrganizationReservationIdentifier(organizationReservation) as number}`,
        copy,
        { observe: 'response' }
      )
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IOrganizationReservation>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IOrganizationReservation[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addOrganizationReservationToCollectionIfMissing(
    organizationReservationCollection: IOrganizationReservation[],
    ...organizationReservationsToCheck: (IOrganizationReservation | null | undefined)[]
  ): IOrganizationReservation[] {
    const organizationReservations: IOrganizationReservation[] = organizationReservationsToCheck.filter(isPresent);
    if (organizationReservations.length > 0) {
      const organizationReservationCollectionIdentifiers = organizationReservationCollection.map(
        organizationReservationItem => getOrganizationReservationIdentifier(organizationReservationItem)!
      );
      const organizationReservationsToAdd = organizationReservations.filter(organizationReservationItem => {
        const organizationReservationIdentifier = getOrganizationReservationIdentifier(organizationReservationItem);
        if (
          organizationReservationIdentifier == null ||
          organizationReservationCollectionIdentifiers.includes(organizationReservationIdentifier)
        ) {
          return false;
        }
        organizationReservationCollectionIdentifiers.push(organizationReservationIdentifier);
        return true;
      });
      return [...organizationReservationsToAdd, ...organizationReservationCollection];
    }
    return organizationReservationCollection;
  }

  protected convertDateFromClient(organizationReservation: IOrganizationReservation): IOrganizationReservation {
    return Object.assign({}, organizationReservation, {
      date: organizationReservation.date?.isValid() ? organizationReservation.date.toJSON() : undefined,
      dateFrom: organizationReservation.dateFrom?.isValid() ? organizationReservation.dateFrom.toJSON() : undefined,
      dateUntil: organizationReservation.dateUntil?.isValid() ? organizationReservation.dateUntil.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.date = res.body.date ? dayjs(res.body.date) : undefined;
      res.body.dateFrom = res.body.dateFrom ? dayjs(res.body.dateFrom) : undefined;
      res.body.dateUntil = res.body.dateUntil ? dayjs(res.body.dateUntil) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((organizationReservation: IOrganizationReservation) => {
        organizationReservation.date = organizationReservation.date ? dayjs(organizationReservation.date) : undefined;
        organizationReservation.dateFrom = organizationReservation.dateFrom ? dayjs(organizationReservation.dateFrom) : undefined;
        organizationReservation.dateUntil = organizationReservation.dateUntil ? dayjs(organizationReservation.dateUntil) : undefined;
      });
    }
    return res;
  }
}
