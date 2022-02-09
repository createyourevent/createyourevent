import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IEventProductRatingComment, EventProductRatingComment } from '../event-product-rating-comment.model';

import { EventProductRatingCommentService } from './event-product-rating-comment.service';

describe('EventProductRatingComment Service', () => {
  let service: EventProductRatingCommentService;
  let httpMock: HttpTestingController;
  let elemDefault: IEventProductRatingComment;
  let expectedResult: IEventProductRatingComment | IEventProductRatingComment[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(EventProductRatingCommentService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      comment: 'AAAAAAA',
      date: currentDate,
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

    it('should create a EventProductRatingComment', () => {
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

      service.create(new EventProductRatingComment()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a EventProductRatingComment', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          comment: 'BBBBBB',
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

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a EventProductRatingComment', () => {
      const patchObject = Object.assign(
        {
          comment: 'BBBBBB',
          date: currentDate.format(DATE_TIME_FORMAT),
        },
        new EventProductRatingComment()
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

    it('should return a list of EventProductRatingComment', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          comment: 'BBBBBB',
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

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a EventProductRatingComment', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addEventProductRatingCommentToCollectionIfMissing', () => {
      it('should add a EventProductRatingComment to an empty array', () => {
        const eventProductRatingComment: IEventProductRatingComment = { id: 123 };
        expectedResult = service.addEventProductRatingCommentToCollectionIfMissing([], eventProductRatingComment);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(eventProductRatingComment);
      });

      it('should not add a EventProductRatingComment to an array that contains it', () => {
        const eventProductRatingComment: IEventProductRatingComment = { id: 123 };
        const eventProductRatingCommentCollection: IEventProductRatingComment[] = [
          {
            ...eventProductRatingComment,
          },
          { id: 456 },
        ];
        expectedResult = service.addEventProductRatingCommentToCollectionIfMissing(
          eventProductRatingCommentCollection,
          eventProductRatingComment
        );
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a EventProductRatingComment to an array that doesn't contain it", () => {
        const eventProductRatingComment: IEventProductRatingComment = { id: 123 };
        const eventProductRatingCommentCollection: IEventProductRatingComment[] = [{ id: 456 }];
        expectedResult = service.addEventProductRatingCommentToCollectionIfMissing(
          eventProductRatingCommentCollection,
          eventProductRatingComment
        );
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(eventProductRatingComment);
      });

      it('should add only unique EventProductRatingComment to an array', () => {
        const eventProductRatingCommentArray: IEventProductRatingComment[] = [{ id: 123 }, { id: 456 }, { id: 82153 }];
        const eventProductRatingCommentCollection: IEventProductRatingComment[] = [{ id: 123 }];
        expectedResult = service.addEventProductRatingCommentToCollectionIfMissing(
          eventProductRatingCommentCollection,
          ...eventProductRatingCommentArray
        );
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const eventProductRatingComment: IEventProductRatingComment = { id: 123 };
        const eventProductRatingComment2: IEventProductRatingComment = { id: 456 };
        expectedResult = service.addEventProductRatingCommentToCollectionIfMissing(
          [],
          eventProductRatingComment,
          eventProductRatingComment2
        );
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(eventProductRatingComment);
        expect(expectedResult).toContain(eventProductRatingComment2);
      });

      it('should accept null and undefined values', () => {
        const eventProductRatingComment: IEventProductRatingComment = { id: 123 };
        expectedResult = service.addEventProductRatingCommentToCollectionIfMissing([], null, eventProductRatingComment, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(eventProductRatingComment);
      });

      it('should return initial array if no EventProductRatingComment is added', () => {
        const eventProductRatingCommentCollection: IEventProductRatingComment[] = [{ id: 123 }];
        expectedResult = service.addEventProductRatingCommentToCollectionIfMissing(eventProductRatingCommentCollection, undefined, null);
        expect(expectedResult).toEqual(eventProductRatingCommentCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
