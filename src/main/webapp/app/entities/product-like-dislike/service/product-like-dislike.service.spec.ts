import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IProductLikeDislike, ProductLikeDislike } from '../product-like-dislike.model';

import { ProductLikeDislikeService } from './product-like-dislike.service';

describe('ProductLikeDislike Service', () => {
  let service: ProductLikeDislikeService;
  let httpMock: HttpTestingController;
  let elemDefault: IProductLikeDislike;
  let expectedResult: IProductLikeDislike | IProductLikeDislike[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ProductLikeDislikeService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      like: 0,
      dislike: 0,
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

    it('should create a ProductLikeDislike', () => {
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

      service.create(new ProductLikeDislike()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ProductLikeDislike', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          like: 1,
          dislike: 1,
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

    it('should partial update a ProductLikeDislike', () => {
      const patchObject = Object.assign(
        {
          like: 1,
          dislike: 1,
          date: currentDate.format(DATE_TIME_FORMAT),
          comment: 'BBBBBB',
        },
        new ProductLikeDislike()
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

    it('should return a list of ProductLikeDislike', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          like: 1,
          dislike: 1,
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

    it('should delete a ProductLikeDislike', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addProductLikeDislikeToCollectionIfMissing', () => {
      it('should add a ProductLikeDislike to an empty array', () => {
        const productLikeDislike: IProductLikeDislike = { id: 123 };
        expectedResult = service.addProductLikeDislikeToCollectionIfMissing([], productLikeDislike);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(productLikeDislike);
      });

      it('should not add a ProductLikeDislike to an array that contains it', () => {
        const productLikeDislike: IProductLikeDislike = { id: 123 };
        const productLikeDislikeCollection: IProductLikeDislike[] = [
          {
            ...productLikeDislike,
          },
          { id: 456 },
        ];
        expectedResult = service.addProductLikeDislikeToCollectionIfMissing(productLikeDislikeCollection, productLikeDislike);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ProductLikeDislike to an array that doesn't contain it", () => {
        const productLikeDislike: IProductLikeDislike = { id: 123 };
        const productLikeDislikeCollection: IProductLikeDislike[] = [{ id: 456 }];
        expectedResult = service.addProductLikeDislikeToCollectionIfMissing(productLikeDislikeCollection, productLikeDislike);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(productLikeDislike);
      });

      it('should add only unique ProductLikeDislike to an array', () => {
        const productLikeDislikeArray: IProductLikeDislike[] = [{ id: 123 }, { id: 456 }, { id: 12800 }];
        const productLikeDislikeCollection: IProductLikeDislike[] = [{ id: 123 }];
        expectedResult = service.addProductLikeDislikeToCollectionIfMissing(productLikeDislikeCollection, ...productLikeDislikeArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const productLikeDislike: IProductLikeDislike = { id: 123 };
        const productLikeDislike2: IProductLikeDislike = { id: 456 };
        expectedResult = service.addProductLikeDislikeToCollectionIfMissing([], productLikeDislike, productLikeDislike2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(productLikeDislike);
        expect(expectedResult).toContain(productLikeDislike2);
      });

      it('should accept null and undefined values', () => {
        const productLikeDislike: IProductLikeDislike = { id: 123 };
        expectedResult = service.addProductLikeDislikeToCollectionIfMissing([], null, productLikeDislike, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(productLikeDislike);
      });

      it('should return initial array if no ProductLikeDislike is added', () => {
        const productLikeDislikeCollection: IProductLikeDislike[] = [{ id: 123 }];
        expectedResult = service.addProductLikeDislikeToCollectionIfMissing(productLikeDislikeCollection, undefined, null);
        expect(expectedResult).toEqual(productLikeDislikeCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
