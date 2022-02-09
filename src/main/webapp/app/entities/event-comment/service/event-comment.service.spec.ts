import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IEventComment, EventComment } from '../event-comment.model';

import { EventCommentService } from './event-comment.service';

describe('EventComment Service', () => {
  let service: EventCommentService;
  let httpMock: HttpTestingController;
  let elemDefault: IEventComment;
  let expectedResult: IEventComment | IEventComment[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(EventCommentService);
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

    it('should create a EventComment', () => {
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

      service.create(new EventComment()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a EventComment', () => {
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

    it('should partial update a EventComment', () => {
      const patchObject = Object.assign(
        {
          date: currentDate.format(DATE_TIME_FORMAT),
        },
        new EventComment()
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

    it('should return a list of EventComment', () => {
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

    it('should delete a EventComment', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addEventCommentToCollectionIfMissing', () => {
      it('should add a EventComment to an empty array', () => {
        const eventComment: IEventComment = { id: 123 };
        expectedResult = service.addEventCommentToCollectionIfMissing([], eventComment);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(eventComment);
      });

      it('should not add a EventComment to an array that contains it', () => {
        const eventComment: IEventComment = { id: 123 };
        const eventCommentCollection: IEventComment[] = [
          {
            ...eventComment,
          },
          { id: 456 },
        ];
        expectedResult = service.addEventCommentToCollectionIfMissing(eventCommentCollection, eventComment);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a EventComment to an array that doesn't contain it", () => {
        const eventComment: IEventComment = { id: 123 };
        const eventCommentCollection: IEventComment[] = [{ id: 456 }];
        expectedResult = service.addEventCommentToCollectionIfMissing(eventCommentCollection, eventComment);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(eventComment);
      });

      it('should add only unique EventComment to an array', () => {
        const eventCommentArray: IEventComment[] = [{ id: 123 }, { id: 456 }, { id: 95748 }];
        const eventCommentCollection: IEventComment[] = [{ id: 123 }];
        expectedResult = service.addEventCommentToCollectionIfMissing(eventCommentCollection, ...eventCommentArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const eventComment: IEventComment = { id: 123 };
        const eventComment2: IEventComment = { id: 456 };
        expectedResult = service.addEventCommentToCollectionIfMissing([], eventComment, eventComment2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(eventComment);
        expect(expectedResult).toContain(eventComment2);
      });

      it('should accept null and undefined values', () => {
        const eventComment: IEventComment = { id: 123 };
        expectedResult = service.addEventCommentToCollectionIfMissing([], null, eventComment, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(eventComment);
      });

      it('should return initial array if no EventComment is added', () => {
        const eventCommentCollection: IEventComment[] = [{ id: 123 }];
        expectedResult = service.addEventCommentToCollectionIfMissing(eventCommentCollection, undefined, null);
        expect(expectedResult).toEqual(eventCommentCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
