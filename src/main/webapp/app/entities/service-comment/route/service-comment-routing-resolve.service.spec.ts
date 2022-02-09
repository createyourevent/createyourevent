jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IServiceComment, ServiceComment } from '../service-comment.model';
import { ServiceCommentService } from '../service/service-comment.service';

import { ServiceCommentRoutingResolveService } from './service-comment-routing-resolve.service';

describe('ServiceComment routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: ServiceCommentRoutingResolveService;
  let service: ServiceCommentService;
  let resultServiceComment: IServiceComment | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(ServiceCommentRoutingResolveService);
    service = TestBed.inject(ServiceCommentService);
    resultServiceComment = undefined;
  });

  describe('resolve', () => {
    it('should return IServiceComment returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultServiceComment = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultServiceComment).toEqual({ id: 123 });
    });

    it('should return new IServiceComment if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultServiceComment = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultServiceComment).toEqual(new ServiceComment());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as ServiceComment })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultServiceComment = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultServiceComment).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
