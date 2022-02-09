jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IServiceOffer, ServiceOffer } from '../service-offer.model';
import { ServiceOfferService } from '../service/service-offer.service';

import { ServiceOfferRoutingResolveService } from './service-offer-routing-resolve.service';

describe('ServiceOffer routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: ServiceOfferRoutingResolveService;
  let service: ServiceOfferService;
  let resultServiceOffer: IServiceOffer | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(ServiceOfferRoutingResolveService);
    service = TestBed.inject(ServiceOfferService);
    resultServiceOffer = undefined;
  });

  describe('resolve', () => {
    it('should return IServiceOffer returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultServiceOffer = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultServiceOffer).toEqual({ id: 123 });
    });

    it('should return new IServiceOffer if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultServiceOffer = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultServiceOffer).toEqual(new ServiceOffer());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as ServiceOffer })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultServiceOffer = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultServiceOffer).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
