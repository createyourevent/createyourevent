import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IEventServiceMapOrder, EventServiceMapOrder } from '../event-service-map-order.model';

import { EventServiceMapOrderService } from './event-service-map-order.service';

describe('EventServiceMapOrder Service', () => {
  let service: EventServiceMapOrderService;
  let httpMock: HttpTestingController;
  let elemDefault: IEventServiceMapOrder;
  let expectedResult: IEventServiceMapOrder | IEventServiceMapOrder[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(EventServiceMapOrderService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      date: currentDate,
      dateFrom: currentDate,
      dateUntil: currentDate,
      costHour: 0,
      rideCosts: 0,
      total: 0,
      totalHours: 'AAAAAAA',
      kilometre: 0,
      billed: false,
      seen: false,
      approved: false,
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

    it('should create a EventServiceMapOrder', () => {
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

      service.create(new EventServiceMapOrder()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a EventServiceMapOrder', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          date: currentDate.format(DATE_TIME_FORMAT),
          dateFrom: currentDate.format(DATE_TIME_FORMAT),
          dateUntil: currentDate.format(DATE_TIME_FORMAT),
          costHour: 1,
          rideCosts: 1,
          total: 1,
          totalHours: 'BBBBBB',
          kilometre: 1,
          billed: true,
          seen: true,
          approved: true,
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

    it('should partial update a EventServiceMapOrder', () => {
      const patchObject = Object.assign(
        {
          date: currentDate.format(DATE_TIME_FORMAT),
          dateFrom: currentDate.format(DATE_TIME_FORMAT),
          dateUntil: currentDate.format(DATE_TIME_FORMAT),
          rideCosts: 1,
          totalHours: 'BBBBBB',
          kilometre: 1,
          seen: true,
          approved: true,
        },
        new EventServiceMapOrder()
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

    it('should return a list of EventServiceMapOrder', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          date: currentDate.format(DATE_TIME_FORMAT),
          dateFrom: currentDate.format(DATE_TIME_FORMAT),
          dateUntil: currentDate.format(DATE_TIME_FORMAT),
          costHour: 1,
          rideCosts: 1,
          total: 1,
          totalHours: 'BBBBBB',
          kilometre: 1,
          billed: true,
          seen: true,
          approved: true,
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

    it('should delete a EventServiceMapOrder', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addEventServiceMapOrderToCollectionIfMissing', () => {
      it('should add a EventServiceMapOrder to an empty array', () => {
        const eventServiceMapOrder: IEventServiceMapOrder = { id: 123 };
        expectedResult = service.addEventServiceMapOrderToCollectionIfMissing([], eventServiceMapOrder);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(eventServiceMapOrder);
      });

      it('should not add a EventServiceMapOrder to an array that contains it', () => {
        const eventServiceMapOrder: IEventServiceMapOrder = { id: 123 };
        const eventServiceMapOrderCollection: IEventServiceMapOrder[] = [
          {
            ...eventServiceMapOrder,
          },
          { id: 456 },
        ];
        expectedResult = service.addEventServiceMapOrderToCollectionIfMissing(eventServiceMapOrderCollection, eventServiceMapOrder);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a EventServiceMapOrder to an array that doesn't contain it", () => {
        const eventServiceMapOrder: IEventServiceMapOrder = { id: 123 };
        const eventServiceMapOrderCollection: IEventServiceMapOrder[] = [{ id: 456 }];
        expectedResult = service.addEventServiceMapOrderToCollectionIfMissing(eventServiceMapOrderCollection, eventServiceMapOrder);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(eventServiceMapOrder);
      });

      it('should add only unique EventServiceMapOrder to an array', () => {
        const eventServiceMapOrderArray: IEventServiceMapOrder[] = [{ id: 123 }, { id: 456 }, { id: 67077 }];
        const eventServiceMapOrderCollection: IEventServiceMapOrder[] = [{ id: 123 }];
        expectedResult = service.addEventServiceMapOrderToCollectionIfMissing(eventServiceMapOrderCollection, ...eventServiceMapOrderArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const eventServiceMapOrder: IEventServiceMapOrder = { id: 123 };
        const eventServiceMapOrder2: IEventServiceMapOrder = { id: 456 };
        expectedResult = service.addEventServiceMapOrderToCollectionIfMissing([], eventServiceMapOrder, eventServiceMapOrder2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(eventServiceMapOrder);
        expect(expectedResult).toContain(eventServiceMapOrder2);
      });

      it('should accept null and undefined values', () => {
        const eventServiceMapOrder: IEventServiceMapOrder = { id: 123 };
        expectedResult = service.addEventServiceMapOrderToCollectionIfMissing([], null, eventServiceMapOrder, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(eventServiceMapOrder);
      });

      it('should return initial array if no EventServiceMapOrder is added', () => {
        const eventServiceMapOrderCollection: IEventServiceMapOrder[] = [{ id: 123 }];
        expectedResult = service.addEventServiceMapOrderToCollectionIfMissing(eventServiceMapOrderCollection, undefined, null);
        expect(expectedResult).toEqual(eventServiceMapOrderCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
