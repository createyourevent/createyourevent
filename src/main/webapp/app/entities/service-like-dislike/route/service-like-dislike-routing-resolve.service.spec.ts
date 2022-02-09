jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IServiceLikeDislike, ServiceLikeDislike } from '../service-like-dislike.model';
import { ServiceLikeDislikeService } from '../service/service-like-dislike.service';

import { ServiceLikeDislikeRoutingResolveService } from './service-like-dislike-routing-resolve.service';

describe('ServiceLikeDislike routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: ServiceLikeDislikeRoutingResolveService;
  let service: ServiceLikeDislikeService;
  let resultServiceLikeDislike: IServiceLikeDislike | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(ServiceLikeDislikeRoutingResolveService);
    service = TestBed.inject(ServiceLikeDislikeService);
    resultServiceLikeDislike = undefined;
  });

  describe('resolve', () => {
    it('should return IServiceLikeDislike returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultServiceLikeDislike = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultServiceLikeDislike).toEqual({ id: 123 });
    });

    it('should return new IServiceLikeDislike if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultServiceLikeDislike = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultServiceLikeDislike).toEqual(new ServiceLikeDislike());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as ServiceLikeDislike })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultServiceLikeDislike = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultServiceLikeDislike).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
