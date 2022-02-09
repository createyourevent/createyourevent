jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IEventDetails, EventDetails } from '../event-details.model';
import { EventDetailsService } from '../service/event-details.service';

import { EventDetailsRoutingResolveService } from './event-details-routing-resolve.service';

describe('EventDetails routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: EventDetailsRoutingResolveService;
  let service: EventDetailsService;
  let resultEventDetails: IEventDetails | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(EventDetailsRoutingResolveService);
    service = TestBed.inject(EventDetailsService);
    resultEventDetails = undefined;
  });

  describe('resolve', () => {
    it('should return IEventDetails returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultEventDetails = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultEventDetails).toEqual({ id: 123 });
    });

    it('should return new IEventDetails if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultEventDetails = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultEventDetails).toEqual(new EventDetails());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as EventDetails })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultEventDetails = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultEventDetails).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
