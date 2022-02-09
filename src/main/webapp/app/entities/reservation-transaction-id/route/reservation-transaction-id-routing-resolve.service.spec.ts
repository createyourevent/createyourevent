jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IReservationTransactionId, ReservationTransactionId } from '../reservation-transaction-id.model';
import { ReservationTransactionIdService } from '../service/reservation-transaction-id.service';

import { ReservationTransactionIdRoutingResolveService } from './reservation-transaction-id-routing-resolve.service';

describe('ReservationTransactionId routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: ReservationTransactionIdRoutingResolveService;
  let service: ReservationTransactionIdService;
  let resultReservationTransactionId: IReservationTransactionId | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(ReservationTransactionIdRoutingResolveService);
    service = TestBed.inject(ReservationTransactionIdService);
    resultReservationTransactionId = undefined;
  });

  describe('resolve', () => {
    it('should return IReservationTransactionId returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultReservationTransactionId = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultReservationTransactionId).toEqual({ id: 123 });
    });

    it('should return new IReservationTransactionId if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultReservationTransactionId = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultReservationTransactionId).toEqual(new ReservationTransactionId());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as ReservationTransactionId })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultReservationTransactionId = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultReservationTransactionId).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
