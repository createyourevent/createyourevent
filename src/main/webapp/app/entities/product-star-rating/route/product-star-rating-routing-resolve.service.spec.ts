jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IProductStarRating, ProductStarRating } from '../product-star-rating.model';
import { ProductStarRatingService } from '../service/product-star-rating.service';

import { ProductStarRatingRoutingResolveService } from './product-star-rating-routing-resolve.service';

describe('ProductStarRating routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: ProductStarRatingRoutingResolveService;
  let service: ProductStarRatingService;
  let resultProductStarRating: IProductStarRating | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(ProductStarRatingRoutingResolveService);
    service = TestBed.inject(ProductStarRatingService);
    resultProductStarRating = undefined;
  });

  describe('resolve', () => {
    it('should return IProductStarRating returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultProductStarRating = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultProductStarRating).toEqual({ id: 123 });
    });

    it('should return new IProductStarRating if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultProductStarRating = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultProductStarRating).toEqual(new ProductStarRating());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as ProductStarRating })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultProductStarRating = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultProductStarRating).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
