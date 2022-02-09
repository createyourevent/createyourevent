jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IChipsCollectionChips, ChipsCollectionChips } from '../chips-collection-chips.model';
import { ChipsCollectionChipsService } from '../service/chips-collection-chips.service';

import { ChipsCollectionChipsRoutingResolveService } from './chips-collection-chips-routing-resolve.service';

describe('ChipsCollectionChips routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: ChipsCollectionChipsRoutingResolveService;
  let service: ChipsCollectionChipsService;
  let resultChipsCollectionChips: IChipsCollectionChips | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(ChipsCollectionChipsRoutingResolveService);
    service = TestBed.inject(ChipsCollectionChipsService);
    resultChipsCollectionChips = undefined;
  });

  describe('resolve', () => {
    it('should return IChipsCollectionChips returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultChipsCollectionChips = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultChipsCollectionChips).toEqual({ id: 123 });
    });

    it('should return new IChipsCollectionChips if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultChipsCollectionChips = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultChipsCollectionChips).toEqual(new ChipsCollectionChips());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as ChipsCollectionChips })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultChipsCollectionChips = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultChipsCollectionChips).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
