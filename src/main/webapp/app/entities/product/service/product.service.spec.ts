import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { PriceType } from 'app/entities/enumerations/price-type.model';
import { RentType } from 'app/entities/enumerations/rent-type.model';
import { ProductType } from 'app/entities/enumerations/product-type.model';
import { OrderStatus } from 'app/entities/enumerations/order-status.model';
import { Unit } from 'app/entities/enumerations/unit.model';
import { IProduct, Product } from '../product.model';

import { ProductService } from './product.service';

describe('Product Service', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;
  let elemDefault: IProduct;
  let expectedResult: IProduct | IProduct[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      title: 'AAAAAAA',
      keywords: 'AAAAAAA',
      description: 'AAAAAAA',
      dateAdded: currentDate,
      dateModified: currentDate,
      priceType: PriceType.SELL,
      rentType: RentType.HOURLY,
      price: 0,
      photoContentType: 'image/png',
      photo: 'AAAAAAA',
      photo2ContentType: 'image/png',
      photo2: 'AAAAAAA',
      photo3ContentType: 'image/png',
      photo3: 'AAAAAAA',
      youtube: 'AAAAAAA',
      active: false,
      stock: 0,
      productType: ProductType.REAL_ESTATE,
      itemNumber: 'AAAAAAA',
      status: OrderStatus.NEW,
      unit: Unit.ITEM,
      amount: 0,
      motto: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          dateAdded: currentDate.format(DATE_TIME_FORMAT),
          dateModified: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Product', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          dateAdded: currentDate.format(DATE_TIME_FORMAT),
          dateModified: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateAdded: currentDate,
          dateModified: currentDate,
        },
        returnedFromService
      );

      service.create(new Product()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Product', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          title: 'BBBBBB',
          keywords: 'BBBBBB',
          description: 'BBBBBB',
          dateAdded: currentDate.format(DATE_TIME_FORMAT),
          dateModified: currentDate.format(DATE_TIME_FORMAT),
          priceType: 'BBBBBB',
          rentType: 'BBBBBB',
          price: 1,
          photo: 'BBBBBB',
          photo2: 'BBBBBB',
          photo3: 'BBBBBB',
          youtube: 'BBBBBB',
          active: true,
          stock: 1,
          productType: 'BBBBBB',
          itemNumber: 'BBBBBB',
          status: 'BBBBBB',
          unit: 'BBBBBB',
          amount: 1,
          motto: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateAdded: currentDate,
          dateModified: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Product', () => {
      const patchObject = Object.assign(
        {
          title: 'BBBBBB',
          description: 'BBBBBB',
          dateModified: currentDate.format(DATE_TIME_FORMAT),
          priceType: 'BBBBBB',
          rentType: 'BBBBBB',
          price: 1,
          photo2: 'BBBBBB',
          youtube: 'BBBBBB',
          active: true,
          stock: 1,
          productType: 'BBBBBB',
          unit: 'BBBBBB',
          amount: 1,
          motto: 'BBBBBB',
        },
        new Product()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          dateAdded: currentDate,
          dateModified: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Product', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          title: 'BBBBBB',
          keywords: 'BBBBBB',
          description: 'BBBBBB',
          dateAdded: currentDate.format(DATE_TIME_FORMAT),
          dateModified: currentDate.format(DATE_TIME_FORMAT),
          priceType: 'BBBBBB',
          rentType: 'BBBBBB',
          price: 1,
          photo: 'BBBBBB',
          photo2: 'BBBBBB',
          photo3: 'BBBBBB',
          youtube: 'BBBBBB',
          active: true,
          stock: 1,
          productType: 'BBBBBB',
          itemNumber: 'BBBBBB',
          status: 'BBBBBB',
          unit: 'BBBBBB',
          amount: 1,
          motto: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateAdded: currentDate,
          dateModified: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Product', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addProductToCollectionIfMissing', () => {
      it('should add a Product to an empty array', () => {
        const product: IProduct = { id: 123 };
        expectedResult = service.addProductToCollectionIfMissing([], product);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(product);
      });

      it('should not add a Product to an array that contains it', () => {
        const product: IProduct = { id: 123 };
        const productCollection: IProduct[] = [
          {
            ...product,
          },
          { id: 456 },
        ];
        expectedResult = service.addProductToCollectionIfMissing(productCollection, product);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Product to an array that doesn't contain it", () => {
        const product: IProduct = { id: 123 };
        const productCollection: IProduct[] = [{ id: 456 }];
        expectedResult = service.addProductToCollectionIfMissing(productCollection, product);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(product);
      });

      it('should add only unique Product to an array', () => {
        const productArray: IProduct[] = [{ id: 123 }, { id: 456 }, { id: 83951 }];
        const productCollection: IProduct[] = [{ id: 123 }];
        expectedResult = service.addProductToCollectionIfMissing(productCollection, ...productArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const product: IProduct = { id: 123 };
        const product2: IProduct = { id: 456 };
        expectedResult = service.addProductToCollectionIfMissing([], product, product2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(product);
        expect(expectedResult).toContain(product2);
      });

      it('should accept null and undefined values', () => {
        const product: IProduct = { id: 123 };
        expectedResult = service.addProductToCollectionIfMissing([], null, product, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(product);
      });

      it('should return initial array if no Product is added', () => {
        const productCollection: IProduct[] = [{ id: 123 }];
        expectedResult = service.addProductToCollectionIfMissing(productCollection, undefined, null);
        expect(expectedResult).toEqual(productCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
