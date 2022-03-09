jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ISlotListOrange, SlotListOrange } from '../slot-list-orange.model';
import { SlotListOrangeService } from '../service/slot-list-orange.service';

import { SlotListOrangeRoutingResolveService } from './slot-list-orange-routing-resolve.service';

describe('SlotListOrange routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: SlotListOrangeRoutingResolveService;
  let service: SlotListOrangeService;
  let resultSlotListOrange: ISlotListOrange | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(SlotListOrangeRoutingResolveService);
    service = TestBed.inject(SlotListOrangeService);
    resultSlotListOrange = undefined;
  });

  describe('resolve', () => {
    it('should return ISlotListOrange returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultSlotListOrange = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultSlotListOrange).toEqual({ id: 123 });
    });

    it('should return new ISlotListOrange if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultSlotListOrange = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultSlotListOrange).toEqual(new SlotListOrange());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as SlotListOrange })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultSlotListOrange = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultSlotListOrange).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
