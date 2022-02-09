import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IShopLikeDislike, ShopLikeDislike } from '../shop-like-dislike.model';

import { ShopLikeDislikeService } from './shop-like-dislike.service';

describe('ShopLikeDislike Service', () => {
  let service: ShopLikeDislikeService;
  let httpMock: HttpTestingController;
  let elemDefault: IShopLikeDislike;
  let expectedResult: IShopLikeDislike | IShopLikeDislike[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ShopLikeDislikeService);
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

    it('should create a ShopLikeDislike', () => {
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

      service.create(new ShopLikeDislike()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ShopLikeDislike', () => {
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

    it('should partial update a ShopLikeDislike', () => {
      const patchObject = Object.assign(
        {
          date: currentDate.format(DATE_TIME_FORMAT),
          comment: 'BBBBBB',
        },
        new ShopLikeDislike()
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

    it('should return a list of ShopLikeDislike', () => {
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

    it('should delete a ShopLikeDislike', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addShopLikeDislikeToCollectionIfMissing', () => {
      it('should add a ShopLikeDislike to an empty array', () => {
        const shopLikeDislike: IShopLikeDislike = { id: 123 };
        expectedResult = service.addShopLikeDislikeToCollectionIfMissing([], shopLikeDislike);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(shopLikeDislike);
      });

      it('should not add a ShopLikeDislike to an array that contains it', () => {
        const shopLikeDislike: IShopLikeDislike = { id: 123 };
        const shopLikeDislikeCollection: IShopLikeDislike[] = [
          {
            ...shopLikeDislike,
          },
          { id: 456 },
        ];
        expectedResult = service.addShopLikeDislikeToCollectionIfMissing(shopLikeDislikeCollection, shopLikeDislike);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ShopLikeDislike to an array that doesn't contain it", () => {
        const shopLikeDislike: IShopLikeDislike = { id: 123 };
        const shopLikeDislikeCollection: IShopLikeDislike[] = [{ id: 456 }];
        expectedResult = service.addShopLikeDislikeToCollectionIfMissing(shopLikeDislikeCollection, shopLikeDislike);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(shopLikeDislike);
      });

      it('should add only unique ShopLikeDislike to an array', () => {
        const shopLikeDislikeArray: IShopLikeDislike[] = [{ id: 123 }, { id: 456 }, { id: 27924 }];
        const shopLikeDislikeCollection: IShopLikeDislike[] = [{ id: 123 }];
        expectedResult = service.addShopLikeDislikeToCollectionIfMissing(shopLikeDislikeCollection, ...shopLikeDislikeArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const shopLikeDislike: IShopLikeDislike = { id: 123 };
        const shopLikeDislike2: IShopLikeDislike = { id: 456 };
        expectedResult = service.addShopLikeDislikeToCollectionIfMissing([], shopLikeDislike, shopLikeDislike2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(shopLikeDislike);
        expect(expectedResult).toContain(shopLikeDislike2);
      });

      it('should accept null and undefined values', () => {
        const shopLikeDislike: IShopLikeDislike = { id: 123 };
        expectedResult = service.addShopLikeDislikeToCollectionIfMissing([], null, shopLikeDislike, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(shopLikeDislike);
      });

      it('should return initial array if no ShopLikeDislike is added', () => {
        const shopLikeDislikeCollection: IShopLikeDislike[] = [{ id: 123 }];
        expectedResult = service.addShopLikeDislikeToCollectionIfMissing(shopLikeDislikeCollection, undefined, null);
        expect(expectedResult).toEqual(shopLikeDislikeCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
