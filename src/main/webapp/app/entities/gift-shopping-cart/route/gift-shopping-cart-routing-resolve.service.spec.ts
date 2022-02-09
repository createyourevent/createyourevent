jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IGiftShoppingCart, GiftShoppingCart } from '../gift-shopping-cart.model';
import { GiftShoppingCartService } from '../service/gift-shopping-cart.service';

import { GiftShoppingCartRoutingResolveService } from './gift-shopping-cart-routing-resolve.service';

describe('GiftShoppingCart routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: GiftShoppingCartRoutingResolveService;
  let service: GiftShoppingCartService;
  let resultGiftShoppingCart: IGiftShoppingCart | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(GiftShoppingCartRoutingResolveService);
    service = TestBed.inject(GiftShoppingCartService);
    resultGiftShoppingCart = undefined;
  });

  describe('resolve', () => {
    it('should return IGiftShoppingCart returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultGiftShoppingCart = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultGiftShoppingCart).toEqual({ id: 123 });
    });

    it('should return new IGiftShoppingCart if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultGiftShoppingCart = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultGiftShoppingCart).toEqual(new GiftShoppingCart());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as GiftShoppingCart })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultGiftShoppingCart = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultGiftShoppingCart).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
