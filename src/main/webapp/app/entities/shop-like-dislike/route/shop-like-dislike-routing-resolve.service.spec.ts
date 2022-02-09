jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IShopLikeDislike, ShopLikeDislike } from '../shop-like-dislike.model';
import { ShopLikeDislikeService } from '../service/shop-like-dislike.service';

import { ShopLikeDislikeRoutingResolveService } from './shop-like-dislike-routing-resolve.service';

describe('ShopLikeDislike routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: ShopLikeDislikeRoutingResolveService;
  let service: ShopLikeDislikeService;
  let resultShopLikeDislike: IShopLikeDislike | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(ShopLikeDislikeRoutingResolveService);
    service = TestBed.inject(ShopLikeDislikeService);
    resultShopLikeDislike = undefined;
  });

  describe('resolve', () => {
    it('should return IShopLikeDislike returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultShopLikeDislike = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultShopLikeDislike).toEqual({ id: 123 });
    });

    it('should return new IShopLikeDislike if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultShopLikeDislike = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultShopLikeDislike).toEqual(new ShopLikeDislike());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as ShopLikeDislike })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultShopLikeDislike = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultShopLikeDislike).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
