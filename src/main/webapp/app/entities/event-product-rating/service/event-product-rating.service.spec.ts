import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IEventProductRating, EventProductRating } from '../event-product-rating.model';

import { EventProductRatingService } from './event-product-rating.service';

describe('EventProductRating Service', () => {
  let service: EventProductRatingService;
  let httpMock: HttpTestingController;
  let elemDefault: IEventProductRating;
  let expectedResult: IEventProductRating | IEventProductRating[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(EventProductRatingService);
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

    it('should create a EventProductRating', () => {
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

      service.create(new EventProductRating()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a EventProductRating', () => {
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

    it('should partial update a EventProductRating', () => {
      const patchObject = Object.assign(
        {
          date: currentDate.format(DATE_TIME_FORMAT),
        },
        new EventProductRating()
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

    it('should return a list of EventProductRating', () => {
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

    it('should delete a EventProductRating', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addEventProductRatingToCollectionIfMissing', () => {
      it('should add a EventProductRating to an empty array', () => {
        const eventProductRating: IEventProductRating = { id: 123 };
        expectedResult = service.addEventProductRatingToCollectionIfMissing([], eventProductRating);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(eventProductRating);
      });

      it('should not add a EventProductRating to an array that contains it', () => {
        const eventProductRating: IEventProductRating = { id: 123 };
        const eventProductRatingCollection: IEventProductRating[] = [
          {
            ...eventProductRating,
          },
          { id: 456 },
        ];
        expectedResult = service.addEventProductRatingToCollectionIfMissing(eventProductRatingCollection, eventProductRating);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a EventProductRating to an array that doesn't contain it", () => {
        const eventProductRating: IEventProductRating = { id: 123 };
        const eventProductRatingCollection: IEventProductRating[] = [{ id: 456 }];
        expectedResult = service.addEventProductRatingToCollectionIfMissing(eventProductRatingCollection, eventProductRating);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(eventProductRating);
      });

      it('should add only unique EventProductRating to an array', () => {
        const eventProductRatingArray: IEventProductRating[] = [{ id: 123 }, { id: 456 }, { id: 1592 }];
        const eventProductRatingCollection: IEventProductRating[] = [{ id: 123 }];
        expectedResult = service.addEventProductRatingToCollectionIfMissing(eventProductRatingCollection, ...eventProductRatingArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const eventProductRating: IEventProductRating = { id: 123 };
        const eventProductRating2: IEventProductRating = { id: 456 };
        expectedResult = service.addEventProductRatingToCollectionIfMissing([], eventProductRating, eventProductRating2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(eventProductRating);
        expect(expectedResult).toContain(eventProductRating2);
      });

      it('should accept null and undefined values', () => {
        const eventProductRating: IEventProductRating = { id: 123 };
        expectedResult = service.addEventProductRatingToCollectionIfMissing([], null, eventProductRating, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(eventProductRating);
      });

      it('should return initial array if no EventProductRating is added', () => {
        const eventProductRatingCollection: IEventProductRating[] = [{ id: 123 }];
        expectedResult = service.addEventProductRatingToCollectionIfMissing(eventProductRatingCollection, undefined, null);
        expect(expectedResult).toEqual(eventProductRatingCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
