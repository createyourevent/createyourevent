jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IOrganizationLikeDislike, OrganizationLikeDislike } from '../organization-like-dislike.model';
import { OrganizationLikeDislikeService } from '../service/organization-like-dislike.service';

import { OrganizationLikeDislikeRoutingResolveService } from './organization-like-dislike-routing-resolve.service';

describe('OrganizationLikeDislike routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: OrganizationLikeDislikeRoutingResolveService;
  let service: OrganizationLikeDislikeService;
  let resultOrganizationLikeDislike: IOrganizationLikeDislike | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(OrganizationLikeDislikeRoutingResolveService);
    service = TestBed.inject(OrganizationLikeDislikeService);
    resultOrganizationLikeDislike = undefined;
  });

  describe('resolve', () => {
    it('should return IOrganizationLikeDislike returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultOrganizationLikeDislike = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultOrganizationLikeDislike).toEqual({ id: 123 });
    });

    it('should return new IOrganizationLikeDislike if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultOrganizationLikeDislike = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultOrganizationLikeDislike).toEqual(new OrganizationLikeDislike());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as OrganizationLikeDislike })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultOrganizationLikeDislike = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultOrganizationLikeDislike).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
