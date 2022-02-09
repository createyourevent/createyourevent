import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IEventStarRating, EventStarRating } from '../event-star-rating.model';

import { EventStarRatingService } from './event-star-rating.service';

describe('EventStarRating Service', () => {
  let service: EventStarRatingService;
  let httpMock: HttpTestingController;
  let elemDefault: IEventStarRating;
  let expectedResult: IEventStarRating | IEventStarRating[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(EventStarRatingService);
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

    it('should create a EventStarRating', () => {
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

      service.create(new EventStarRating()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a EventStarRating', () => {
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

    it('should partial update a EventStarRating', () => {
      const patchObject = Object.assign(
        {
          stars: 1,
          comment: 'BBBBBB',
        },
        new EventStarRating()
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

    it('should return a list of EventStarRating', () => {
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

    it('should delete a EventStarRating', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addEventStarRatingToCollectionIfMissing', () => {
      it('should add a EventStarRating to an empty array', () => {
        const eventStarRating: IEventStarRating = { id: 123 };
        expectedResult = service.addEventStarRatingToCollectionIfMissing([], eventStarRating);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(eventStarRating);
      });

      it('should not add a EventStarRating to an array that contains it', () => {
        const eventStarRating: IEventStarRating = { id: 123 };
        const eventStarRatingCollection: IEventStarRating[] = [
          {
            ...eventStarRating,
          },
          { id: 456 },
        ];
        expectedResult = service.addEventStarRatingToCollectionIfMissing(eventStarRatingCollection, eventStarRating);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a EventStarRating to an array that doesn't contain it", () => {
        const eventStarRating: IEventStarRating = { id: 123 };
        const eventStarRatingCollection: IEventStarRating[] = [{ id: 456 }];
        expectedResult = service.addEventStarRatingToCollectionIfMissing(eventStarRatingCollection, eventStarRating);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(eventStarRating);
      });

      it('should add only unique EventStarRating to an array', () => {
        const eventStarRatingArray: IEventStarRating[] = [{ id: 123 }, { id: 456 }, { id: 46484 }];
        const eventStarRatingCollection: IEventStarRating[] = [{ id: 123 }];
        expectedResult = service.addEventStarRatingToCollectionIfMissing(eventStarRatingCollection, ...eventStarRatingArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const eventStarRating: IEventStarRating = { id: 123 };
        const eventStarRating2: IEventStarRating = { id: 456 };
        expectedResult = service.addEventStarRatingToCollectionIfMissing([], eventStarRating, eventStarRating2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(eventStarRating);
        expect(expectedResult).toContain(eventStarRating2);
      });

      it('should accept null and undefined values', () => {
        const eventStarRating: IEventStarRating = { id: 123 };
        expectedResult = service.addEventStarRatingToCollectionIfMissing([], null, eventStarRating, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(eventStarRating);
      });

      it('should return initial array if no EventStarRating is added', () => {
        const eventStarRatingCollection: IEventStarRating[] = [{ id: 123 }];
        expectedResult = service.addEventStarRatingToCollectionIfMissing(eventStarRatingCollection, undefined, null);
        expect(expectedResult).toEqual(eventStarRatingCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
