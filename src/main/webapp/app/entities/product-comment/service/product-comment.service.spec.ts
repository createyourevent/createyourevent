import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IProductComment, ProductComment } from '../product-comment.model';

import { ProductCommentService } from './product-comment.service';

describe('ProductComment Service', () => {
  let service: ProductCommentService;
  let httpMock: HttpTestingController;
  let elemDefault: IProductComment;
  let expectedResult: IProductComment | IProductComment[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ProductCommentService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      comment: 'AAAAAAA',
      date: currentDate,
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

    it('should create a ProductComment', () => {
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

      service.create(new ProductComment()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ProductComment', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          comment: 'BBBBBB',
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

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ProductComment', () => {
      const patchObject = Object.assign(
        {
          date: currentDate.format(DATE_TIME_FORMAT),
        },
        new ProductComment()
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

    it('should return a list of ProductComment', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          comment: 'BBBBBB',
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

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a ProductComment', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addProductCommentToCollectionIfMissing', () => {
      it('should add a ProductComment to an empty array', () => {
        const productComment: IProductComment = { id: 123 };
        expectedResult = service.addProductCommentToCollectionIfMissing([], productComment);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(productComment);
      });

      it('should not add a ProductComment to an array that contains it', () => {
        const productComment: IProductComment = { id: 123 };
        const productCommentCollection: IProductComment[] = [
          {
            ...productComment,
          },
          { id: 456 },
        ];
        expectedResult = service.addProductCommentToCollectionIfMissing(productCommentCollection, productComment);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ProductComment to an array that doesn't contain it", () => {
        const productComment: IProductComment = { id: 123 };
        const productCommentCollection: IProductComment[] = [{ id: 456 }];
        expectedResult = service.addProductCommentToCollectionIfMissing(productCommentCollection, productComment);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(productComment);
      });

      it('should add only unique ProductComment to an array', () => {
        const productCommentArray: IProductComment[] = [{ id: 123 }, { id: 456 }, { id: 34963 }];
        const productCommentCollection: IProductComment[] = [{ id: 123 }];
        expectedResult = service.addProductCommentToCollectionIfMissing(productCommentCollection, ...productCommentArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const productComment: IProductComment = { id: 123 };
        const productComment2: IProductComment = { id: 456 };
        expectedResult = service.addProductCommentToCollectionIfMissing([], productComment, productComment2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(productComment);
        expect(expectedResult).toContain(productComment2);
      });

      it('should accept null and undefined values', () => {
        const productComment: IProductComment = { id: 123 };
        expectedResult = service.addProductCommentToCollectionIfMissing([], null, productComment, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(productComment);
      });

      it('should return initial array if no ProductComment is added', () => {
        const productCommentCollection: IProductComment[] = [{ id: 123 }];
        expectedResult = service.addProductCommentToCollectionIfMissing(productCommentCollection, undefined, null);
        expect(expectedResult).toEqual(productCommentCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
