import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IOrganizationLikeDislike, getOrganizationLikeDislikeIdentifier } from '../organization-like-dislike.model';

export type EntityResponseType = HttpResponse<IOrganizationLikeDislike>;
export type EntityArrayResponseType = HttpResponse<IOrganizationLikeDislike[]>;

@Injectable({ providedIn: 'root' })
export class OrganizationLikeDislikeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/organization-like-dislikes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(organizationLikeDislike: IOrganizationLikeDislike): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(organizationLikeDislike);
    return this.http
      .post<IOrganizationLikeDislike>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(organizationLikeDislike: IOrganizationLikeDislike): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(organizationLikeDislike);
    return this.http
      .put<IOrganizationLikeDislike>(
        `${this.resourceUrl}/${getOrganizationLikeDislikeIdentifier(organizationLikeDislike) as number}`,
        copy,
        { observe: 'response' }
      )
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(organizationLikeDislike: IOrganizationLikeDislike): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(organizationLikeDislike);
    return this.http
      .patch<IOrganizationLikeDislike>(
        `${this.resourceUrl}/${getOrganizationLikeDislikeIdentifier(organizationLikeDislike) as number}`,
        copy,
        { observe: 'response' }
      )
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IOrganizationLikeDislike>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IOrganizationLikeDislike[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addOrganizationLikeDislikeToCollectionIfMissing(
    organizationLikeDislikeCollection: IOrganizationLikeDislike[],
    ...organizationLikeDislikesToCheck: (IOrganizationLikeDislike | null | undefined)[]
  ): IOrganizationLikeDislike[] {
    const organizationLikeDislikes: IOrganizationLikeDislike[] = organizationLikeDislikesToCheck.filter(isPresent);
    if (organizationLikeDislikes.length > 0) {
      const organizationLikeDislikeCollectionIdentifiers = organizationLikeDislikeCollection.map(
        organizationLikeDislikeItem => getOrganizationLikeDislikeIdentifier(organizationLikeDislikeItem)!
      );
      const organizationLikeDislikesToAdd = organizationLikeDislikes.filter(organizationLikeDislikeItem => {
        const organizationLikeDislikeIdentifier = getOrganizationLikeDislikeIdentifier(organizationLikeDislikeItem);
        if (
          organizationLikeDislikeIdentifier == null ||
          organizationLikeDislikeCollectionIdentifiers.includes(organizationLikeDislikeIdentifier)
        ) {
          return false;
        }
        organizationLikeDislikeCollectionIdentifiers.push(organizationLikeDislikeIdentifier);
        return true;
      });
      return [...organizationLikeDislikesToAdd, ...organizationLikeDislikeCollection];
    }
    return organizationLikeDislikeCollection;
  }

  protected convertDateFromClient(organizationLikeDislike: IOrganizationLikeDislike): IOrganizationLikeDislike {
    return Object.assign({}, organizationLikeDislike, {
      date: organizationLikeDislike.date?.isValid() ? organizationLikeDislike.date.toJSON() : undefined,
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
      res.body.forEach((organizationLikeDislike: IOrganizationLikeDislike) => {
        organizationLikeDislike.date = organizationLikeDislike.date ? dayjs(organizationLikeDislike.date) : undefined;
      });
    }
    return res;
  }
}
