jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IEventProductRatingComment, EventProductRatingComment } from '../event-product-rating-comment.model';
import { EventProductRatingCommentService } from '../service/event-product-rating-comment.service';

import { EventProductRatingCommentRoutingResolveService } from './event-product-rating-comment-routing-resolve.service';

describe('EventProductRatingComment routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: EventProductRatingCommentRoutingResolveService;
  let service: EventProductRatingCommentService;
  let resultEventProductRatingComment: IEventProductRatingComment | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(EventProductRatingCommentRoutingResolveService);
    service = TestBed.inject(EventProductRatingCommentService);
    resultEventProductRatingComment = undefined;
  });

  describe('resolve', () => {
    it('should return IEventProductRatingComment returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultEventProductRatingComment = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultEventProductRatingComment).toEqual({ id: 123 });
    });

    it('should return new IEventProductRatingComment if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultEventProductRatingComment = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultEventProductRatingComment).toEqual(new EventProductRatingComment());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as EventProductRatingComment })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultEventProductRatingComment = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultEventProductRatingComment).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
