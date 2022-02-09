jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IFeeTransactionEntry, FeeTransactionEntry } from '../fee-transaction-entry.model';
import { FeeTransactionEntryService } from '../service/fee-transaction-entry.service';

import { FeeTransactionEntryRoutingResolveService } from './fee-transaction-entry-routing-resolve.service';

describe('FeeTransactionEntry routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: FeeTransactionEntryRoutingResolveService;
  let service: FeeTransactionEntryService;
  let resultFeeTransactionEntry: IFeeTransactionEntry | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(FeeTransactionEntryRoutingResolveService);
    service = TestBed.inject(FeeTransactionEntryService);
    resultFeeTransactionEntry = undefined;
  });

  describe('resolve', () => {
    it('should return IFeeTransactionEntry returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultFeeTransactionEntry = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultFeeTransactionEntry).toEqual({ id: 123 });
    });

    it('should return new IFeeTransactionEntry if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultFeeTransactionEntry = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultFeeTransactionEntry).toEqual(new FeeTransactionEntry());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as FeeTransactionEntry })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultFeeTransactionEntry = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultFeeTransactionEntry).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
