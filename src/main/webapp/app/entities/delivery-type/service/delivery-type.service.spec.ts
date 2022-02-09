import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DeliveryTypes } from 'app/entities/enumerations/delivery-types.model';
import { IDeliveryType, DeliveryType } from '../delivery-type.model';

import { DeliveryTypeService } from './delivery-type.service';

describe('DeliveryType Service', () => {
  let service: DeliveryTypeService;
  let httpMock: HttpTestingController;
  let elemDefault: IDeliveryType;
  let expectedResult: IDeliveryType | IDeliveryType[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(DeliveryTypeService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      deliveryType: DeliveryTypes.PICKUP,
      minimumOrderQuantity: 0,
      price: 0,
      pricePerKilometre: 0,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a DeliveryType', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new DeliveryType()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a DeliveryType', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          deliveryType: 'BBBBBB',
          minimumOrderQuantity: 1,
          price: 1,
          pricePerKilometre: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a DeliveryType', () => {
      const patchObject = Object.assign(
        {
          minimumOrderQuantity: 1,
        },
        new DeliveryType()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of DeliveryType', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          deliveryType: 'BBBBBB',
          minimumOrderQuantity: 1,
          price: 1,
          pricePerKilometre: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a DeliveryType', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addDeliveryTypeToCollectionIfMissing', () => {
      it('should add a DeliveryType to an empty array', () => {
        const deliveryType: IDeliveryType = { id: 123 };
        expectedResult = service.addDeliveryTypeToCollectionIfMissing([], deliveryType);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(deliveryType);
      });

      it('should not add a DeliveryType to an array that contains it', () => {
        const deliveryType: IDeliveryType = { id: 123 };
        const deliveryTypeCollection: IDeliveryType[] = [
          {
            ...deliveryType,
          },
          { id: 456 },
        ];
        expectedResult = service.addDeliveryTypeToCollectionIfMissing(deliveryTypeCollection, deliveryType);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a DeliveryType to an array that doesn't contain it", () => {
        const deliveryType: IDeliveryType = { id: 123 };
        const deliveryTypeCollection: IDeliveryType[] = [{ id: 456 }];
        expectedResult = service.addDeliveryTypeToCollectionIfMissing(deliveryTypeCollection, deliveryType);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(deliveryType);
      });

      it('should add only unique DeliveryType to an array', () => {
        const deliveryTypeArray: IDeliveryType[] = [{ id: 123 }, { id: 456 }, { id: 39611 }];
        const deliveryTypeCollection: IDeliveryType[] = [{ id: 123 }];
        expectedResult = service.addDeliveryTypeToCollectionIfMissing(deliveryTypeCollection, ...deliveryTypeArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const deliveryType: IDeliveryType = { id: 123 };
        const deliveryType2: IDeliveryType = { id: 456 };
        expectedResult = service.addDeliveryTypeToCollectionIfMissing([], deliveryType, deliveryType2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(deliveryType);
        expect(expectedResult).toContain(deliveryType2);
      });

      it('should accept null and undefined values', () => {
        const deliveryType: IDeliveryType = { id: 123 };
        expectedResult = service.addDeliveryTypeToCollectionIfMissing([], null, deliveryType, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(deliveryType);
      });

      it('should return initial array if no DeliveryType is added', () => {
        const deliveryTypeCollection: IDeliveryType[] = [{ id: 123 }];
        expectedResult = service.addDeliveryTypeToCollectionIfMissing(deliveryTypeCollection, undefined, null);
        expect(expectedResult).toEqual(deliveryTypeCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
