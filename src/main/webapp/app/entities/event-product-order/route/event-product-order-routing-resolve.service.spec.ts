jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IEventProductOrder, EventProductOrder } from '../event-product-order.model';
import { EventProductOrderService } from '../service/event-product-order.service';

import { EventProductOrderRoutingResolveService } from './event-product-order-routing-resolve.service';

describe('EventProductOrder routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: EventProductOrderRoutingResolveService;
  let service: EventProductOrderService;
  let resultEventProductOrder: IEventProductOrder | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(EventProductOrderRoutingResolveService);
    service = TestBed.inject(EventProductOrderService);
    resultEventProductOrder = undefined;
  });

  describe('resolve', () => {
    it('should return IEventProductOrder returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultEventProductOrder = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultEventProductOrder).toEqual({ id: 123 });
    });

    it('should return new IEventProductOrder if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultEventProductOrder = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultEventProductOrder).toEqual(new EventProductOrder());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as EventProductOrder })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultEventProductOrder = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultEventProductOrder).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
