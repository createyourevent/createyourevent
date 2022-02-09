jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IUserExtension, UserExtension } from '../user-extension.model';
import { UserExtensionService } from '../service/user-extension.service';

import { UserExtensionRoutingResolveService } from './user-extension-routing-resolve.service';

describe('UserExtension routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: UserExtensionRoutingResolveService;
  let service: UserExtensionService;
  let resultUserExtension: IUserExtension | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(UserExtensionRoutingResolveService);
    service = TestBed.inject(UserExtensionService);
    resultUserExtension = undefined;
  });

  describe('resolve', () => {
    it('should return IUserExtension returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultUserExtension = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultUserExtension).toEqual({ id: 123 });
    });

    it('should return new IUserExtension if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultUserExtension = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultUserExtension).toEqual(new UserExtension());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as UserExtension })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultUserExtension = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultUserExtension).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
