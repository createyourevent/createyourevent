import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IShopStarRating, ShopStarRating } from '../shop-star-rating.model';

import { ShopStarRatingService } from './shop-star-rating.service';

describe('ShopStarRating Service', () => {
  let service: ShopStarRatingService;
  let httpMock: HttpTestingController;
  let elemDefault: IShopStarRating;
  let expectedResult: IShopStarRating | IShopStarRating[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ShopStarRatingService);
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

    it('should create a ShopStarRating', () => {
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

      service.create(new ShopStarRating()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ShopStarRating', () => {
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

    it('should partial update a ShopStarRating', () => {
      const patchObject = Object.assign(
        {
          stars: 1,
          date: currentDate.format(DATE_TIME_FORMAT),
        },
        new ShopStarRating()
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

    it('should return a list of ShopStarRating', () => {
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

    it('should delete a ShopStarRating', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addShopStarRatingToCollectionIfMissing', () => {
      it('should add a ShopStarRating to an empty array', () => {
        const shopStarRating: IShopStarRating = { id: 123 };
        expectedResult = service.addShopStarRatingToCollectionIfMissing([], shopStarRating);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(shopStarRating);
      });

      it('should not add a ShopStarRating to an array that contains it', () => {
        const shopStarRating: IShopStarRating = { id: 123 };
        const shopStarRatingCollection: IShopStarRating[] = [
          {
            ...shopStarRating,
          },
          { id: 456 },
        ];
        expectedResult = service.addShopStarRatingToCollectionIfMissing(shopStarRatingCollection, shopStarRating);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ShopStarRating to an array that doesn't contain it", () => {
        const shopStarRating: IShopStarRating = { id: 123 };
        const shopStarRatingCollection: IShopStarRating[] = [{ id: 456 }];
        expectedResult = service.addShopStarRatingToCollectionIfMissing(shopStarRatingCollection, shopStarRating);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(shopStarRating);
      });

      it('should add only unique ShopStarRating to an array', () => {
        const shopStarRatingArray: IShopStarRating[] = [{ id: 123 }, { id: 456 }, { id: 6117 }];
        const shopStarRatingCollection: IShopStarRating[] = [{ id: 123 }];
        expectedResult = service.addShopStarRatingToCollectionIfMissing(shopStarRatingCollection, ...shopStarRatingArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const shopStarRating: IShopStarRating = { id: 123 };
        const shopStarRating2: IShopStarRating = { id: 456 };
        expectedResult = service.addShopStarRatingToCollectionIfMissing([], shopStarRating, shopStarRating2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(shopStarRating);
        expect(expectedResult).toContain(shopStarRating2);
      });

      it('should accept null and undefined values', () => {
        const shopStarRating: IShopStarRating = { id: 123 };
        expectedResult = service.addShopStarRatingToCollectionIfMissing([], null, shopStarRating, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(shopStarRating);
      });

      it('should return initial array if no ShopStarRating is added', () => {
        const shopStarRatingCollection: IShopStarRating[] = [{ id: 123 }];
        expectedResult = service.addShopStarRatingToCollectionIfMissing(shopStarRatingCollection, undefined, null);
        expect(expectedResult).toEqual(shopStarRatingCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
