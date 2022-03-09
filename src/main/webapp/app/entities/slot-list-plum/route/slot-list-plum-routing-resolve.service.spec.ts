jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ISlotListPlum, SlotListPlum } from '../slot-list-plum.model';
import { SlotListPlumService } from '../service/slot-list-plum.service';

import { SlotListPlumRoutingResolveService } from './slot-list-plum-routing-resolve.service';

describe('SlotListPlum routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: SlotListPlumRoutingResolveService;
  let service: SlotListPlumService;
  let resultSlotListPlum: ISlotListPlum | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(SlotListPlumRoutingResolveService);
    service = TestBed.inject(SlotListPlumService);
    resultSlotListPlum = undefined;
  });

  describe('resolve', () => {
    it('should return ISlotListPlum returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultSlotListPlum = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultSlotListPlum).toEqual({ id: 123 });
    });

    it('should return new ISlotListPlum if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultSlotListPlum = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultSlotListPlum).toEqual(new SlotListPlum());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as SlotListPlum })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultSlotListPlum = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultSlotListPlum).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
