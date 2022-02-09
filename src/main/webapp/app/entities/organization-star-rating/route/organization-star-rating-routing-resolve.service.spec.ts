jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IOrganizationStarRating, OrganizationStarRating } from '../organization-star-rating.model';
import { OrganizationStarRatingService } from '../service/organization-star-rating.service';

import { OrganizationStarRatingRoutingResolveService } from './organization-star-rating-routing-resolve.service';

describe('OrganizationStarRating routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: OrganizationStarRatingRoutingResolveService;
  let service: OrganizationStarRatingService;
  let resultOrganizationStarRating: IOrganizationStarRating | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(OrganizationStarRatingRoutingResolveService);
    service = TestBed.inject(OrganizationStarRatingService);
    resultOrganizationStarRating = undefined;
  });

  describe('resolve', () => {
    it('should return IOrganizationStarRating returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultOrganizationStarRating = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultOrganizationStarRating).toEqual({ id: 123 });
    });

    it('should return new IOrganizationStarRating if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultOrganizationStarRating = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultOrganizationStarRating).toEqual(new OrganizationStarRating());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as OrganizationStarRating })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultOrganizationStarRating = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultOrganizationStarRating).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
