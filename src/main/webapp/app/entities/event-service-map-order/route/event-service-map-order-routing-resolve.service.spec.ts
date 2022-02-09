jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IEventServiceMapOrder, EventServiceMapOrder } from '../event-service-map-order.model';
import { EventServiceMapOrderService } from '../service/event-service-map-order.service';

import { EventServiceMapOrderRoutingResolveService } from './event-service-map-order-routing-resolve.service';

describe('EventServiceMapOrder routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: EventServiceMapOrderRoutingResolveService;
  let service: EventServiceMapOrderService;
  let resultEventServiceMapOrder: IEventServiceMapOrder | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(EventServiceMapOrderRoutingResolveService);
    service = TestBed.inject(EventServiceMapOrderService);
    resultEventServiceMapOrder = undefined;
  });

  describe('resolve', () => {
    it('should return IEventServiceMapOrder returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultEventServiceMapOrder = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultEventServiceMapOrder).toEqual({ id: 123 });
    });

    it('should return new IEventServiceMapOrder if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultEventServiceMapOrder = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultEventServiceMapOrder).toEqual(new EventServiceMapOrder());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as EventServiceMapOrder })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultEventServiceMapOrder = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultEventServiceMapOrder).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
