jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IServiceStarRating, ServiceStarRating } from '../service-star-rating.model';
import { ServiceStarRatingService } from '../service/service-star-rating.service';

import { ServiceStarRatingRoutingResolveService } from './service-star-rating-routing-resolve.service';

describe('ServiceStarRating routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: ServiceStarRatingRoutingResolveService;
  let service: ServiceStarRatingService;
  let resultServiceStarRating: IServiceStarRating | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(ServiceStarRatingRoutingResolveService);
    service = TestBed.inject(ServiceStarRatingService);
    resultServiceStarRating = undefined;
  });

  describe('resolve', () => {
    it('should return IServiceStarRating returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultServiceStarRating = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultServiceStarRating).toEqual({ id: 123 });
    });

    it('should return new IServiceStarRating if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultServiceStarRating = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultServiceStarRating).toEqual(new ServiceStarRating());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as ServiceStarRating })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultServiceStarRating = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultServiceStarRating).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
