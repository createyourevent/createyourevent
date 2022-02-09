import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IServiceComment, getServiceCommentIdentifier } from '../service-comment.model';

export type EntityResponseType = HttpResponse<IServiceComment>;
export type EntityArrayResponseType = HttpResponse<IServiceComment[]>;

@Injectable({ providedIn: 'root' })
export class ServiceCommentService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/service-comments');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(serviceComment: IServiceComment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(serviceComment);
    return this.http
      .post<IServiceComment>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(serviceComment: IServiceComment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(serviceComment);
    return this.http
      .put<IServiceComment>(`${this.resourceUrl}/${getServiceCommentIdentifier(serviceComment) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(serviceComment: IServiceComment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(serviceComment);
    return this.http
      .patch<IServiceComment>(`${this.resourceUrl}/${getServiceCommentIdentifier(serviceComment) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IServiceComment>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IServiceComment[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addServiceCommentToCollectionIfMissing(
    serviceCommentCollection: IServiceComment[],
    ...serviceCommentsToCheck: (IServiceComment | null | undefined)[]
  ): IServiceComment[] {
    const serviceComments: IServiceComment[] = serviceCommentsToCheck.filter(isPresent);
    if (serviceComments.length > 0) {
      const serviceCommentCollectionIdentifiers = serviceCommentCollection.map(
        serviceCommentItem => getServiceCommentIdentifier(serviceCommentItem)!
      );
      const serviceCommentsToAdd = serviceComments.filter(serviceCommentItem => {
        const serviceCommentIdentifier = getServiceCommentIdentifier(serviceCommentItem);
        if (serviceCommentIdentifier == null || serviceCommentCollectionIdentifiers.includes(serviceCommentIdentifier)) {
          return false;
        }
        serviceCommentCollectionIdentifiers.push(serviceCommentIdentifier);
        return true;
      });
      return [...serviceCommentsToAdd, ...serviceCommentCollection];
    }
    return serviceCommentCollection;
  }

  protected convertDateFromClient(serviceComment: IServiceComment): IServiceComment {
    return Object.assign({}, serviceComment, {
      date: serviceComment.date?.isValid() ? serviceComment.date.toJSON() : undefined,
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
      res.body.forEach((serviceComment: IServiceComment) => {
        serviceComment.date = serviceComment.date ? dayjs(serviceComment.date) : undefined;
      });
    }
    return res;
  }
}
