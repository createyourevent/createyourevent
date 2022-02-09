import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IGiftShoppingCart, GiftShoppingCart } from '../gift-shopping-cart.model';

import { GiftShoppingCartService } from './gift-shopping-cart.service';

describe('GiftShoppingCart Service', () => {
  let service: GiftShoppingCartService;
  let httpMock: HttpTestingController;
  let elemDefault: IGiftShoppingCart;
  let expectedResult: IGiftShoppingCart | IGiftShoppingCart[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(GiftShoppingCartService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      date: currentDate,
      amount: 0,
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

    it('should create a GiftShoppingCart', () => {
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

      service.create(new GiftShoppingCart()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a GiftShoppingCart', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          date: currentDate.format(DATE_TIME_FORMAT),
          amount: 1,
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

    it('should partial update a GiftShoppingCart', () => {
      const patchObject = Object.assign(
        {
          date: currentDate.format(DATE_TIME_FORMAT),
          amount: 1,
        },
        new GiftShoppingCart()
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

    it('should return a list of GiftShoppingCart', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          date: currentDate.format(DATE_TIME_FORMAT),
          amount: 1,
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

    it('should delete a GiftShoppingCart', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addGiftShoppingCartToCollectionIfMissing', () => {
      it('should add a GiftShoppingCart to an empty array', () => {
        const giftShoppingCart: IGiftShoppingCart = { id: 123 };
        expectedResult = service.addGiftShoppingCartToCollectionIfMissing([], giftShoppingCart);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(giftShoppingCart);
      });

      it('should not add a GiftShoppingCart to an array that contains it', () => {
        const giftShoppingCart: IGiftShoppingCart = { id: 123 };
        const giftShoppingCartCollection: IGiftShoppingCart[] = [
          {
            ...giftShoppingCart,
          },
          { id: 456 },
        ];
        expectedResult = service.addGiftShoppingCartToCollectionIfMissing(giftShoppingCartCollection, giftShoppingCart);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a GiftShoppingCart to an array that doesn't contain it", () => {
        const giftShoppingCart: IGiftShoppingCart = { id: 123 };
        const giftShoppingCartCollection: IGiftShoppingCart[] = [{ id: 456 }];
        expectedResult = service.addGiftShoppingCartToCollectionIfMissing(giftShoppingCartCollection, giftShoppingCart);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(giftShoppingCart);
      });

      it('should add only unique GiftShoppingCart to an array', () => {
        const giftShoppingCartArray: IGiftShoppingCart[] = [{ id: 123 }, { id: 456 }, { id: 33815 }];
        const giftShoppingCartCollection: IGiftShoppingCart[] = [{ id: 123 }];
        expectedResult = service.addGiftShoppingCartToCollectionIfMissing(giftShoppingCartCollection, ...giftShoppingCartArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const giftShoppingCart: IGiftShoppingCart = { id: 123 };
        const giftShoppingCart2: IGiftShoppingCart = { id: 456 };
        expectedResult = service.addGiftShoppingCartToCollectionIfMissing([], giftShoppingCart, giftShoppingCart2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(giftShoppingCart);
        expect(expectedResult).toContain(giftShoppingCart2);
      });

      it('should accept null and undefined values', () => {
        const giftShoppingCart: IGiftShoppingCart = { id: 123 };
        expectedResult = service.addGiftShoppingCartToCollectionIfMissing([], null, giftShoppingCart, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(giftShoppingCart);
      });

      it('should return initial array if no GiftShoppingCart is added', () => {
        const giftShoppingCartCollection: IGiftShoppingCart[] = [{ id: 123 }];
        expectedResult = service.addGiftShoppingCartToCollectionIfMissing(giftShoppingCartCollection, undefined, null);
        expect(expectedResult).toEqual(giftShoppingCartCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
