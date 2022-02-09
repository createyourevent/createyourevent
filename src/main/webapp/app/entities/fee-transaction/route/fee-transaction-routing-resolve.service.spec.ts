jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IFeeTransaction, FeeTransaction } from '../fee-transaction.model';
import { FeeTransactionService } from '../service/fee-transaction.service';

import { FeeTransactionRoutingResolveService } from './fee-transaction-routing-resolve.service';

describe('FeeTransaction routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: FeeTransactionRoutingResolveService;
  let service: FeeTransactionService;
  let resultFeeTransaction: IFeeTransaction | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(FeeTransactionRoutingResolveService);
    service = TestBed.inject(FeeTransactionService);
    resultFeeTransaction = undefined;
  });

  describe('resolve', () => {
    it('should return IFeeTransaction returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultFeeTransaction = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultFeeTransaction).toEqual({ id: 123 });
    });

    it('should return new IFeeTransaction if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultFeeTransaction = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultFeeTransaction).toEqual(new FeeTransaction());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as FeeTransaction })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultFeeTransaction = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultFeeTransaction).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
