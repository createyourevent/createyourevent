jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IAdminFeesPrice, AdminFeesPrice } from '../admin-fees-price.model';
import { AdminFeesPriceService } from '../service/admin-fees-price.service';

import { AdminFeesPriceRoutingResolveService } from './admin-fees-price-routing-resolve.service';

describe('AdminFeesPrice routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: AdminFeesPriceRoutingResolveService;
  let service: AdminFeesPriceService;
  let resultAdminFeesPrice: IAdminFeesPrice | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(AdminFeesPriceRoutingResolveService);
    service = TestBed.inject(AdminFeesPriceService);
    resultAdminFeesPrice = undefined;
  });

  describe('resolve', () => {
    it('should return IAdminFeesPrice returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultAdminFeesPrice = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultAdminFeesPrice).toEqual({ id: 123 });
    });

    it('should return new IAdminFeesPrice if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultAdminFeesPrice = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultAdminFeesPrice).toEqual(new AdminFeesPrice());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as AdminFeesPrice })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultAdminFeesPrice = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultAdminFeesPrice).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
