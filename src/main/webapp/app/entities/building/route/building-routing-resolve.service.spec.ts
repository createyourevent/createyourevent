jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IBuilding, Building } from '../building.model';
import { BuildingService } from '../service/building.service';

import { BuildingRoutingResolveService } from './building-routing-resolve.service';

describe('Building routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: BuildingRoutingResolveService;
  let service: BuildingService;
  let resultBuilding: IBuilding | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(BuildingRoutingResolveService);
    service = TestBed.inject(BuildingService);
    resultBuilding = undefined;
  });

  describe('resolve', () => {
    it('should return IBuilding returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultBuilding = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultBuilding).toEqual({ id: 123 });
    });

    it('should return new IBuilding if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultBuilding = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultBuilding).toEqual(new Building());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Building })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultBuilding = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultBuilding).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
