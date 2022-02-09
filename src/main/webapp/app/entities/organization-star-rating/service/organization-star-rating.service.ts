import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IOrganizationStarRating, getOrganizationStarRatingIdentifier } from '../organization-star-rating.model';

export type EntityResponseType = HttpResponse<IOrganizationStarRating>;
export type EntityArrayResponseType = HttpResponse<IOrganizationStarRating[]>;

@Injectable({ providedIn: 'root' })
export class OrganizationStarRatingService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/organization-star-ratings');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(organizationStarRating: IOrganizationStarRating): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(organizationStarRating);
    return this.http
      .post<IOrganizationStarRating>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(organizationStarRating: IOrganizationStarRating): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(organizationStarRating);
    return this.http
      .put<IOrganizationStarRating>(`${this.resourceUrl}/${getOrganizationStarRatingIdentifier(organizationStarRating) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(organizationStarRating: IOrganizationStarRating): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(organizationStarRating);
    return this.http
      .patch<IOrganizationStarRating>(
        `${this.resourceUrl}/${getOrganizationStarRatingIdentifier(organizationStarRating) as number}`,
        copy,
        { observe: 'response' }
      )
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IOrganizationStarRating>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IOrganizationStarRating[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addOrganizationStarRatingToCollectionIfMissing(
    organizationStarRatingCollection: IOrganizationStarRating[],
    ...organizationStarRatingsToCheck: (IOrganizationStarRating | null | undefined)[]
  ): IOrganizationStarRating[] {
    const organizationStarRatings: IOrganizationStarRating[] = organizationStarRatingsToCheck.filter(isPresent);
    if (organizationStarRatings.length > 0) {
      const organizationStarRatingCollectionIdentifiers = organizationStarRatingCollection.map(
        organizationStarRatingItem => getOrganizationStarRatingIdentifier(organizationStarRatingItem)!
      );
      const organizationStarRatingsToAdd = organizationStarRatings.filter(organizationStarRatingItem => {
        const organizationStarRatingIdentifier = getOrganizationStarRatingIdentifier(organizationStarRatingItem);
        if (
          organizationStarRatingIdentifier == null ||
          organizationStarRatingCollectionIdentifiers.includes(organizationStarRatingIdentifier)
        ) {
          return false;
        }
        organizationStarRatingCollectionIdentifiers.push(organizationStarRatingIdentifier);
        return true;
      });
      return [...organizationStarRatingsToAdd, ...organizationStarRatingCollection];
    }
    return organizationStarRatingCollection;
  }

  protected convertDateFromClient(organizationStarRating: IOrganizationStarRating): IOrganizationStarRating {
    return Object.assign({}, organizationStarRating, {
      date: organizationStarRating.date?.isValid() ? organizationStarRating.date.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.date = res.body.date ? dayjs(res.body.date) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((organizationStarRating: IOrganizationStarRating) => {
        organizationStarRating.date = organizationStarRating.date ? dayjs(organizationStarRating.date) : undefined;
      });
    }
    return res;
  }
}
