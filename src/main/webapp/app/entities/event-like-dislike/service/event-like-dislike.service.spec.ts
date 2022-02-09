import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IEventLikeDislike, EventLikeDislike } from '../event-like-dislike.model';

import { EventLikeDislikeService } from './event-like-dislike.service';

describe('EventLikeDislike Service', () => {
  let service: EventLikeDislikeService;
  let httpMock: HttpTestingController;
  let elemDefault: IEventLikeDislike;
  let expectedResult: IEventLikeDislike | IEventLikeDislike[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(EventLikeDislikeService);
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

    it('should create a EventLikeDislike', () => {
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

      service.create(new EventLikeDislike()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a EventLikeDislike', () => {
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

    it('should partial update a EventLikeDislike', () => {
      const patchObject = Object.assign({}, new EventLikeDislike());

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

    it('should return a list of EventLikeDislike', () => {
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

    it('should delete a EventLikeDislike', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addEventLikeDislikeToCollectionIfMissing', () => {
      it('should add a EventLikeDislike to an empty array', () => {
        const eventLikeDislike: IEventLikeDislike = { id: 123 };
        expectedResult = service.addEventLikeDislikeToCollectionIfMissing([], eventLikeDislike);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(eventLikeDislike);
      });

      it('should not add a EventLikeDislike to an array that contains it', () => {
        const eventLikeDislike: IEventLikeDislike = { id: 123 };
        const eventLikeDislikeCollection: IEventLikeDislike[] = [
          {
            ...eventLikeDislike,
          },
          { id: 456 },
        ];
        expectedResult = service.addEventLikeDislikeToCollectionIfMissing(eventLikeDislikeCollection, eventLikeDislike);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a EventLikeDislike to an array that doesn't contain it", () => {
        const eventLikeDislike: IEventLikeDislike = { id: 123 };
        const eventLikeDislikeCollection: IEventLikeDislike[] = [{ id: 456 }];
        expectedResult = service.addEventLikeDislikeToCollectionIfMissing(eventLikeDislikeCollection, eventLikeDislike);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(eventLikeDislike);
      });

      it('should add only unique EventLikeDislike to an array', () => {
        const eventLikeDislikeArray: IEventLikeDislike[] = [{ id: 123 }, { id: 456 }, { id: 13059 }];
        const eventLikeDislikeCollection: IEventLikeDislike[] = [{ id: 123 }];
        expectedResult = service.addEventLikeDislikeToCollectionIfMissing(eventLikeDislikeCollection, ...eventLikeDislikeArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const eventLikeDislike: IEventLikeDislike = { id: 123 };
        const eventLikeDislike2: IEventLikeDislike = { id: 456 };
        expectedResult = service.addEventLikeDislikeToCollectionIfMissing([], eventLikeDislike, eventLikeDislike2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(eventLikeDislike);
        expect(expectedResult).toContain(eventLikeDislike2);
      });

      it('should accept null and undefined values', () => {
        const eventLikeDislike: IEventLikeDislike = { id: 123 };
        expectedResult = service.addEventLikeDislikeToCollectionIfMissing([], null, eventLikeDislike, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(eventLikeDislike);
      });

      it('should return initial array if no EventLikeDislike is added', () => {
        const eventLikeDislikeCollection: IEventLikeDislike[] = [{ id: 123 }];
        expectedResult = service.addEventLikeDislikeToCollectionIfMissing(eventLikeDislikeCollection, undefined, null);
        expect(expectedResult).toEqual(eventLikeDislikeCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
