jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IRideCosts, RideCosts } from '../ride-costs.model';
import { RideCostsService } from '../service/ride-costs.service';

import { RideCostsRoutingResolveService } from './ride-costs-routing-resolve.service';

describe('RideCosts routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: RideCostsRoutingResolveService;
  let service: RideCostsService;
  let resultRideCosts: IRideCosts | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(RideCostsRoutingResolveService);
    service = TestBed.inject(RideCostsService);
    resultRideCosts = undefined;
  });

  describe('resolve', () => {
    it('should return IRideCosts returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultRideCosts = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultRideCosts).toEqual({ id: 123 });
    });

    it('should return new IRideCosts if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultRideCosts = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultRideCosts).toEqual(new RideCosts());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as RideCosts })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultRideCosts = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultRideCosts).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
