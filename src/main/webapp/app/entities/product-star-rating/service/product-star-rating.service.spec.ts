import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IProductStarRating, ProductStarRating } from '../product-star-rating.model';

import { ProductStarRatingService } from './product-star-rating.service';

describe('ProductStarRating Service', () => {
  let service: ProductStarRatingService;
  let httpMock: HttpTestingController;
  let elemDefault: IProductStarRating;
  let expectedResult: IProductStarRating | IProductStarRating[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ProductStarRatingService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      stars: 0,
      date: currentDate,
      comment: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          date: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a ProductStarRating', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          date: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          date: currentDate,
        },
        returnedFromService
      );

      service.create(new ProductStarRating()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ProductStarRating', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          stars: 1,
          date: currentDate.format(DATE_TIME_FORMAT),
          comment: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          date: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ProductStarRating', () => {
      const patchObject = Object.assign(
        {
          stars: 1,
          comment: 'BBBBBB',
        },
        new ProductStarRating()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          date: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ProductStarRating', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          stars: 1,
          date: currentDate.format(DATE_TIME_FORMAT),
          comment: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          date: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a ProductStarRating', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addProductStarRatingToCollectionIfMissing', () => {
      it('should add a ProductStarRating to an empty array', () => {
        const productStarRating: IProductStarRating = { id: 123 };
        expectedResult = service.addProductStarRatingToCollectionIfMissing([], productStarRating);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(productStarRating);
      });

      it('should not add a ProductStarRating to an array that contains it', () => {
        const productStarRating: IProductStarRating = { id: 123 };
        const productStarRatingCollection: IProductStarRating[] = [
          {
            ...productStarRating,
          },
          { id: 456 },
        ];
        expectedResult = service.addProductStarRatingToCollectionIfMissing(productStarRatingCollection, productStarRating);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ProductStarRating to an array that doesn't contain it", () => {
        const productStarRating: IProductStarRating = { id: 123 };
        const productStarRatingCollection: IProductStarRating[] = [{ id: 456 }];
        expectedResult = service.addProductStarRatingToCollectionIfMissing(productStarRatingCollection, productStarRating);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(productStarRating);
      });

      it('should add only unique ProductStarRating to an array', () => {
        const productStarRatingArray: IProductStarRating[] = [{ id: 123 }, { id: 456 }, { id: 48357 }];
        const productStarRatingCollection: IProductStarRating[] = [{ id: 123 }];
        expectedResult = service.addProductStarRatingToCollectionIfMissing(productStarRatingCollection, ...productStarRatingArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const productStarRating: IProductStarRating = { id: 123 };
        const productStarRating2: IProductStarRating = { id: 456 };
        expectedResult = service.addProductStarRatingToCollectionIfMissing([], productStarRating, productStarRating2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(productStarRating);
        expect(expectedResult).toContain(productStarRating2);
      });

      it('should accept null and undefined values', () => {
        const productStarRating: IProductStarRating = { id: 123 };
        expectedResult = service.addProductStarRatingToCollectionIfMissing([], null, productStarRating, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(productStarRating);
      });

      it('should return initial array if no ProductStarRating is added', () => {
        const productStarRatingCollection: IProductStarRating[] = [{ id: 123 }];
        expectedResult = service.addProductStarRatingToCollectionIfMissing(productStarRatingCollection, undefined, null);
        expect(expectedResult).toEqual(productStarRatingCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
