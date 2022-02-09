import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IServiceComment, ServiceComment } from '../service-comment.model';

import { ServiceCommentService } from './service-comment.service';

describe('ServiceComment Service', () => {
  let service: ServiceCommentService;
  let httpMock: HttpTestingController;
  let elemDefault: IServiceComment;
  let expectedResult: IServiceComment | IServiceComment[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ServiceCommentService);
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

    it('should create a ServiceComment', () => {
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

      service.create(new ServiceComment()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ServiceComment', () => {
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

    it('should partial update a ServiceComment', () => {
      const patchObject = Object.assign(
        {
          date: currentDate.format(DATE_TIME_FORMAT),
        },
        new ServiceComment()
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

    it('should return a list of ServiceComment', () => {
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

    it('should delete a ServiceComment', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addServiceCommentToCollectionIfMissing', () => {
      it('should add a ServiceComment to an empty array', () => {
        const serviceComment: IServiceComment = { id: 123 };
        expectedResult = service.addServiceCommentToCollectionIfMissing([], serviceComment);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(serviceComment);
      });

      it('should not add a ServiceComment to an array that contains it', () => {
        const serviceComment: IServiceComment = { id: 123 };
        const serviceCommentCollection: IServiceComment[] = [
          {
            ...serviceComment,
          },
          { id: 456 },
        ];
        expectedResult = service.addServiceCommentToCollectionIfMissing(serviceCommentCollection, serviceComment);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ServiceComment to an array that doesn't contain it", () => {
        const serviceComment: IServiceComment = { id: 123 };
        const serviceCommentCollection: IServiceComment[] = [{ id: 456 }];
        expectedResult = service.addServiceCommentToCollectionIfMissing(serviceCommentCollection, serviceComment);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(serviceComment);
      });

      it('should add only unique ServiceComment to an array', () => {
        const serviceCommentArray: IServiceComment[] = [{ id: 123 }, { id: 456 }, { id: 63589 }];
        const serviceCommentCollection: IServiceComment[] = [{ id: 123 }];
        expectedResult = service.addServiceCommentToCollectionIfMissing(serviceCommentCollection, ...serviceCommentArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const serviceComment: IServiceComment = { id: 123 };
        const serviceComment2: IServiceComment = { id: 456 };
        expectedResult = service.addServiceCommentToCollectionIfMissing([], serviceComment, serviceComment2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(serviceComment);
        expect(expectedResult).toContain(serviceComment2);
      });

      it('should accept null and undefined values', () => {
        const serviceComment: IServiceComment = { id: 123 };
        expectedResult = service.addServiceCommentToCollectionIfMissing([], null, serviceComment, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(serviceComment);
      });

      it('should return initial array if no ServiceComment is added', () => {
        const serviceCommentCollection: IServiceComment[] = [{ id: 123 }];
        expectedResult = service.addServiceCommentToCollectionIfMissing(serviceCommentCollection, undefined, null);
        expect(expectedResult).toEqual(serviceCommentCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
