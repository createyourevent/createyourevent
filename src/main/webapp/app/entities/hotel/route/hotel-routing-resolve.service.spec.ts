jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IHotel, Hotel } from '../hotel.model';
import { HotelService } from '../service/hotel.service';

import { HotelRoutingResolveService } from './hotel-routing-resolve.service';

describe('Hotel routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: HotelRoutingResolveService;
  let service: HotelService;
  let resultHotel: IHotel | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(HotelRoutingResolveService);
    service = TestBed.inject(HotelService);
    resultHotel = undefined;
  });

  describe('resolve', () => {
    it('should return IHotel returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultHotel = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultHotel).toEqual({ id: 123 });
    });

    it('should return new IHotel if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultHotel = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultHotel).toEqual(new Hotel());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Hotel })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultHotel = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultHotel).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
