jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IChipsAdmin, ChipsAdmin } from '../chips-admin.model';
import { ChipsAdminService } from '../service/chips-admin.service';

import { ChipsAdminRoutingResolveService } from './chips-admin-routing-resolve.service';

describe('ChipsAdmin routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: ChipsAdminRoutingResolveService;
  let service: ChipsAdminService;
  let resultChipsAdmin: IChipsAdmin | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(ChipsAdminRoutingResolveService);
    service = TestBed.inject(ChipsAdminService);
    resultChipsAdmin = undefined;
  });

  describe('resolve', () => {
    it('should return IChipsAdmin returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultChipsAdmin = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultChipsAdmin).toEqual({ id: 123 });
    });

    it('should return new IChipsAdmin if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultChipsAdmin = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultChipsAdmin).toEqual(new ChipsAdmin());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as ChipsAdmin })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultChipsAdmin = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultChipsAdmin).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
