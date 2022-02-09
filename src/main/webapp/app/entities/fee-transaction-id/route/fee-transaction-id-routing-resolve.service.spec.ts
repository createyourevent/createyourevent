jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IFeeTransactionId, FeeTransactionId } from '../fee-transaction-id.model';
import { FeeTransactionIdService } from '../service/fee-transaction-id.service';

import { FeeTransactionIdRoutingResolveService } from './fee-transaction-id-routing-resolve.service';

describe('FeeTransactionId routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: FeeTransactionIdRoutingResolveService;
  let service: FeeTransactionIdService;
  let resultFeeTransactionId: IFeeTransactionId | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(FeeTransactionIdRoutingResolveService);
    service = TestBed.inject(FeeTransactionIdService);
    resultFeeTransactionId = undefined;
  });

  describe('resolve', () => {
    it('should return IFeeTransactionId returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultFeeTransactionId = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultFeeTransactionId).toEqual({ id: 123 });
    });

    it('should return new IFeeTransactionId if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultFeeTransactionId = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultFeeTransactionId).toEqual(new FeeTransactionId());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as FeeTransactionId })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultFeeTransactionId = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultFeeTransactionId).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
