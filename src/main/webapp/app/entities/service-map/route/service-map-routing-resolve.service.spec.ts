jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IServiceMap, ServiceMap } from '../service-map.model';
import { ServiceMapService } from '../service/service-map.service';

import { ServiceMapRoutingResolveService } from './service-map-routing-resolve.service';

describe('ServiceMap routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: ServiceMapRoutingResolveService;
  let service: ServiceMapService;
  let resultServiceMap: IServiceMap | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(ServiceMapRoutingResolveService);
    service = TestBed.inject(ServiceMapService);
    resultServiceMap = undefined;
  });

  describe('resolve', () => {
    it('should return IServiceMap returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultServiceMap = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultServiceMap).toEqual({ id: 123 });
    });

    it('should return new IServiceMap if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultServiceMap = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultServiceMap).toEqual(new ServiceMap());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as ServiceMap })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultServiceMap = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultServiceMap).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
