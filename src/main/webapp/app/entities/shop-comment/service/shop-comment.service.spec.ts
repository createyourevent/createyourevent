import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IShopComment, ShopComment } from '../shop-comment.model';

import { ShopCommentService } from './shop-comment.service';

describe('ShopComment Service', () => {
  let service: ShopCommentService;
  let httpMock: HttpTestingController;
  let elemDefault: IShopComment;
  let expectedResult: IShopComment | IShopComment[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ShopCommentService);
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

    it('should create a ShopComment', () => {
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

      service.create(new ShopComment()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ShopComment', () => {
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

    it('should partial update a ShopComment', () => {
      const patchObject = Object.assign(
        {
          comment: 'BBBBBB',
          date: currentDate.format(DATE_TIME_FORMAT),
        },
        new ShopComment()
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

    it('should return a list of ShopComment', () => {
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

    it('should delete a ShopComment', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addShopCommentToCollectionIfMissing', () => {
      it('should add a ShopComment to an empty array', () => {
        const shopComment: IShopComment = { id: 123 };
        expectedResult = service.addShopCommentToCollectionIfMissing([], shopComment);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(shopComment);
      });

      it('should not add a ShopComment to an array that contains it', () => {
        const shopComment: IShopComment = { id: 123 };
        const shopCommentCollection: IShopComment[] = [
          {
            ...shopComment,
          },
          { id: 456 },
        ];
        expectedResult = service.addShopCommentToCollectionIfMissing(shopCommentCollection, shopComment);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ShopComment to an array that doesn't contain it", () => {
        const shopComment: IShopComment = { id: 123 };
        const shopCommentCollection: IShopComment[] = [{ id: 456 }];
        expectedResult = service.addShopCommentToCollectionIfMissing(shopCommentCollection, shopComment);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(shopComment);
      });

      it('should add only unique ShopComment to an array', () => {
        const shopCommentArray: IShopComment[] = [{ id: 123 }, { id: 456 }, { id: 87074 }];
        const shopCommentCollection: IShopComment[] = [{ id: 123 }];
        expectedResult = service.addShopCommentToCollectionIfMissing(shopCommentCollection, ...shopCommentArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const shopComment: IShopComment = { id: 123 };
        const shopComment2: IShopComment = { id: 456 };
        expectedResult = service.addShopCommentToCollectionIfMissing([], shopComment, shopComment2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(shopComment);
        expect(expectedResult).toContain(shopComment2);
      });

      it('should accept null and undefined values', () => {
        const shopComment: IShopComment = { id: 123 };
        expectedResult = service.addShopCommentToCollectionIfMissing([], null, shopComment, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(shopComment);
      });

      it('should return initial array if no ShopComment is added', () => {
        const shopCommentCollection: IShopComment[] = [{ id: 123 }];
        expectedResult = service.addShopCommentToCollectionIfMissing(shopCommentCollection, undefined, null);
        expect(expectedResult).toEqual(shopCommentCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
