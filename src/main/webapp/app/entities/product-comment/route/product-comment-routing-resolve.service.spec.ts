jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IProductComment, ProductComment } from '../product-comment.model';
import { ProductCommentService } from '../service/product-comment.service';

import { ProductCommentRoutingResolveService } from './product-comment-routing-resolve.service';

describe('ProductComment routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: ProductCommentRoutingResolveService;
  let service: ProductCommentService;
  let resultProductComment: IProductComment | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(ProductCommentRoutingResolveService);
    service = TestBed.inject(ProductCommentService);
    resultProductComment = undefined;
  });

  describe('resolve', () => {
    it('should return IProductComment returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultProductComment = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultProductComment).toEqual({ id: 123 });
    });

    it('should return new IProductComment if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultProductComment = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultProductComment).toEqual(new ProductComment());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as ProductComment })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultProductComment = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultProductComment).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
