import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { RentStatus } from 'app/entities/enumerations/rent-status.model';
import { IEventProductOrder, EventProductOrder } from '../event-product-order.model';

import { EventProductOrderService } from './event-product-order.service';

describe('EventProductOrder Service', () => {
  let service: EventProductOrderService;
  let httpMock: HttpTestingController;
  let elemDefault: IEventProductOrder;
  let expectedResult: IEventProductOrder | IEventProductOrder[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(EventProductOrderService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      amount: 0,
      total: 0,
      date: currentDate,
      rentalPeriod: 0,
      dateFrom: currentDate,
      dateUntil: currentDate,
      status: RentStatus.BOOKED,
      billed: false,
      seen: false,
      approved: false,
      sellingPrice: 0,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          date: currentDate.format(DATE_TIME_FORMAT),
          dateFrom: currentDate.format(DATE_TIME_FORMAT),
          dateUntil: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a EventProductOrder', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          date: currentDate.format(DATE_TIME_FORMAT),
          dateFrom: currentDate.format(DATE_TIME_FORMAT),
          dateUntil: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          date: currentDate,
          dateFrom: currentDate,
          dateUntil: currentDate,
        },
        returnedFromService
      );

      service.create(new EventProductOrder()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a EventProductOrder', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          amount: 1,
          total: 1,
          date: currentDate.format(DATE_TIME_FORMAT),
          rentalPeriod: 1,
          dateFrom: currentDate.format(DATE_TIME_FORMAT),
          dateUntil: currentDate.format(DATE_TIME_FORMAT),
          status: 'BBBBBB',
          billed: true,
          seen: true,
          approved: true,
          sellingPrice: 1,
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          date: currentDate,
          dateFrom: currentDate,
          dateUntil: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a EventProductOrder', () => {
      const patchObject = Object.assign(
        {
          dateFrom: currentDate.format(DATE_TIME_FORMAT),
          dateUntil: currentDate.format(DATE_TIME_FORMAT),
          billed: true,
          seen: true,
          approved: true,
        },
        new EventProductOrder()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          date: currentDate,
          dateFrom: currentDate,
          dateUntil: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of EventProductOrder', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          amount: 1,
          total: 1,
          date: currentDate.format(DATE_TIME_FORMAT),
          rentalPeriod: 1,
          dateFrom: currentDate.format(DATE_TIME_FORMAT),
          dateUntil: currentDate.format(DATE_TIME_FORMAT),
          status: 'BBBBBB',
          billed: true,
          seen: true,
          approved: true,
          sellingPrice: 1,
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          date: currentDate,
          dateFrom: currentDate,
          dateUntil: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a EventProductOrder', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addEventProductOrderToCollectionIfMissing', () => {
      it('should add a EventProductOrder to an empty array', () => {
        const eventProductOrder: IEventProductOrder = { id: 123 };
        expectedResult = service.addEventProductOrderToCollectionIfMissing([], eventProductOrder);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(eventProductOrder);
      });

      it('should not add a EventProductOrder to an array that contains it', () => {
        const eventProductOrder: IEventProductOrder = { id: 123 };
        const eventProductOrderCollection: IEventProductOrder[] = [
          {
            ...eventProductOrder,
          },
          { id: 456 },
        ];
        expectedResult = service.addEventProductOrderToCollectionIfMissing(eventProductOrderCollection, eventProductOrder);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a EventProductOrder to an array that doesn't contain it", () => {
        const eventProductOrder: IEventProductOrder = { id: 123 };
        const eventProductOrderCollection: IEventProductOrder[] = [{ id: 456 }];
        expectedResult = service.addEventProductOrderToCollectionIfMissing(eventProductOrderCollection, eventProductOrder);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(eventProductOrder);
      });

      it('should add only unique EventProductOrder to an array', () => {
        const eventProductOrderArray: IEventProductOrder[] = [{ id: 123 }, { id: 456 }, { id: 99161 }];
        const eventProductOrderCollection: IEventProductOrder[] = [{ id: 123 }];
        expectedResult = service.addEventProductOrderToCollectionIfMissing(eventProductOrderCollection, ...eventProductOrderArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const eventProductOrder: IEventProductOrder = { id: 123 };
        const eventProductOrder2: IEventProductOrder = { id: 456 };
        expectedResult = service.addEventProductOrderToCollectionIfMissing([], eventProductOrder, eventProductOrder2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(eventProductOrder);
        expect(expectedResult).toContain(eventProductOrder2);
      });

      it('should accept null and undefined values', () => {
        const eventProductOrder: IEventProductOrder = { id: 123 };
        expectedResult = service.addEventProductOrderToCollectionIfMissing([], null, eventProductOrder, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(eventProductOrder);
      });

      it('should return initial array if no EventProductOrder is added', () => {
        const eventProductOrderCollection: IEventProductOrder[] = [{ id: 123 }];
        expectedResult = service.addEventProductOrderToCollectionIfMissing(eventProductOrderCollection, undefined, null);
        expect(expectedResult).toEqual(eventProductOrderCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
