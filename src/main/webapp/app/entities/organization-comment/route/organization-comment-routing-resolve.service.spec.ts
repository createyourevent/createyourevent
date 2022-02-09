jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IOrganizationComment, OrganizationComment } from '../organization-comment.model';
import { OrganizationCommentService } from '../service/organization-comment.service';

import { OrganizationCommentRoutingResolveService } from './organization-comment-routing-resolve.service';

describe('OrganizationComment routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: OrganizationCommentRoutingResolveService;
  let service: OrganizationCommentService;
  let resultOrganizationComment: IOrganizationComment | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(OrganizationCommentRoutingResolveService);
    service = TestBed.inject(OrganizationCommentService);
    resultOrganizationComment = undefined;
  });

  describe('resolve', () => {
    it('should return IOrganizationComment returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultOrganizationComment = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultOrganizationComment).toEqual({ id: 123 });
    });

    it('should return new IOrganizationComment if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultOrganizationComment = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultOrganizationComment).toEqual(new OrganizationComment());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as OrganizationComment })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultOrganizationComment = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultOrganizationComment).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
