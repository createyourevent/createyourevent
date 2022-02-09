jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ICreateYourEventService, CreateYourEventService } from '../create-your-event-service.model';
import { CreateYourEventServiceService } from '../service/create-your-event-service.service';

import { CreateYourEventServiceRoutingResolveService } from './create-your-event-service-routing-resolve.service';

describe('CreateYourEventService routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: CreateYourEventServiceRoutingResolveService;
  let service: CreateYourEventServiceService;
  let resultCreateYourEventService: ICreateYourEventService | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(CreateYourEventServiceRoutingResolveService);
    service = TestBed.inject(CreateYourEventServiceService);
    resultCreateYourEventService = undefined;
  });

  describe('resolve', () => {
    it('should return ICreateYourEventService returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultCreateYourEventService = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultCreateYourEventService).toEqual({ id: 123 });
    });

    it('should return new ICreateYourEventService if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultCreateYourEventService = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultCreateYourEventService).toEqual(new CreateYourEventService());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as CreateYourEventService })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultCreateYourEventService = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultCreateYourEventService).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
