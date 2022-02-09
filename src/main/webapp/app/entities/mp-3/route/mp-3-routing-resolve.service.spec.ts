jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IMp3, Mp3 } from '../mp-3.model';
import { Mp3Service } from '../service/mp-3.service';

import { Mp3RoutingResolveService } from './mp-3-routing-resolve.service';

describe('Mp3 routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: Mp3RoutingResolveService;
  let service: Mp3Service;
  let resultMp3: IMp3 | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(Mp3RoutingResolveService);
    service = TestBed.inject(Mp3Service);
    resultMp3 = undefined;
  });

  describe('resolve', () => {
    it('should return IMp3 returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultMp3 = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultMp3).toEqual({ id: 123 });
    });

    it('should return new IMp3 if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultMp3 = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultMp3).toEqual(new Mp3());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Mp3 })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultMp3 = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultMp3).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
