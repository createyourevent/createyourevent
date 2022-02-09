import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IOrganizationComment, getOrganizationCommentIdentifier } from '../organization-comment.model';

export type EntityResponseType = HttpResponse<IOrganizationComment>;
export type EntityArrayResponseType = HttpResponse<IOrganizationComment[]>;

@Injectable({ providedIn: 'root' })
export class OrganizationCommentService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/organization-comments');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(organizationComment: IOrganizationComment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(organizationComment);
    return this.http
      .post<IOrganizationComment>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(organizationComment: IOrganizationComment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(organizationComment);
    return this.http
      .put<IOrganizationComment>(`${this.resourceUrl}/${getOrganizationCommentIdentifier(organizationComment) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(organizationComment: IOrganizationComment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(organizationComment);
    return this.http
      .patch<IOrganizationComment>(`${this.resourceUrl}/${getOrganizationCommentIdentifier(organizationComment) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IOrganizationComment>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IOrganizationComment[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addOrganizationCommentToCollectionIfMissing(
    organizationCommentCollection: IOrganizationComment[],
    ...organizationCommentsToCheck: (IOrganizationComment | null | undefined)[]
  ): IOrganizationComment[] {
    const organizationComments: IOrganizationComment[] = organizationCommentsToCheck.filter(isPresent);
    if (organizationComments.length > 0) {
      const organizationCommentCollectionIdentifiers = organizationCommentCollection.map(
        organizationCommentItem => getOrganizationCommentIdentifier(organizationCommentItem)!
      );
      const organizationCommentsToAdd = organizationComments.filter(organizationCommentItem => {
        const organizationCommentIdentifier = getOrganizationCommentIdentifier(organizationCommentItem);
        if (organizationCommentIdentifier == null || organizationCommentCollectionIdentifiers.includes(organizationCommentIdentifier)) {
          return false;
        }
        organizationCommentCollectionIdentifiers.push(organizationCommentIdentifier);
        return true;
      });
      return [...organizationCommentsToAdd, ...organizationCommentCollection];
    }
    return organizationCommentCollection;
  }

  protected convertDateFromClient(organizationComment: IOrganizationComment): IOrganizationComment {
    return Object.assign({}, organizationComment, {
      date: organizationComment.date?.isValid() ? organizationComment.date.toJSON() : undefined,
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
      res.body.forEach((organizationComment: IOrganizationComment) => {
        organizationComment.date = organizationComment.date ? dayjs(organizationComment.date) : undefined;
      });
    }
    return res;
  }
}
