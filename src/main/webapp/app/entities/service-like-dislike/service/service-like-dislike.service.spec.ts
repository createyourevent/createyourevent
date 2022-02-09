import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IServiceLikeDislike, ServiceLikeDislike } from '../service-like-dislike.model';

import { ServiceLikeDislikeService } from './service-like-dislike.service';

describe('ServiceLikeDislike Service', () => {
  let service: ServiceLikeDislikeService;
  let httpMock: HttpTestingController;
  let elemDefault: IServiceLikeDislike;
  let expectedResult: IServiceLikeDislike | IServiceLikeDislike[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ServiceLikeDislikeService);
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

    it('should create a ServiceLikeDislike', () => {
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

      service.create(new ServiceLikeDislike()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ServiceLikeDislike', () => {
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

    it('should partial update a ServiceLikeDislike', () => {
      const patchObject = Object.assign(
        {
          like: 1,
          comment: 'BBBBBB',
        },
        new ServiceLikeDislike()
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

    it('should return a list of ServiceLikeDislike', () => {
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

    it('should delete a ServiceLikeDislike', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addServiceLikeDislikeToCollectionIfMissing', () => {
      it('should add a ServiceLikeDislike to an empty array', () => {
        const serviceLikeDislike: IServiceLikeDislike = { id: 123 };
        expectedResult = service.addServiceLikeDislikeToCollectionIfMissing([], serviceLikeDislike);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(serviceLikeDislike);
      });

      it('should not add a ServiceLikeDislike to an array that contains it', () => {
        const serviceLikeDislike: IServiceLikeDislike = { id: 123 };
        const serviceLikeDislikeCollection: IServiceLikeDislike[] = [
          {
            ...serviceLikeDislike,
          },
          { id: 456 },
        ];
        expectedResult = service.addServiceLikeDislikeToCollectionIfMissing(serviceLikeDislikeCollection, serviceLikeDislike);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ServiceLikeDislike to an array that doesn't contain it", () => {
        const serviceLikeDislike: IServiceLikeDislike = { id: 123 };
        const serviceLikeDislikeCollection: IServiceLikeDislike[] = [{ id: 456 }];
        expectedResult = service.addServiceLikeDislikeToCollectionIfMissing(serviceLikeDislikeCollection, serviceLikeDislike);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(serviceLikeDislike);
      });

      it('should add only unique ServiceLikeDislike to an array', () => {
        const serviceLikeDislikeArray: IServiceLikeDislike[] = [{ id: 123 }, { id: 456 }, { id: 15609 }];
        const serviceLikeDislikeCollection: IServiceLikeDislike[] = [{ id: 123 }];
        expectedResult = service.addServiceLikeDislikeToCollectionIfMissing(serviceLikeDislikeCollection, ...serviceLikeDislikeArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const serviceLikeDislike: IServiceLikeDislike = { id: 123 };
        const serviceLikeDislike2: IServiceLikeDislike = { id: 456 };
        expectedResult = service.addServiceLikeDislikeToCollectionIfMissing([], serviceLikeDislike, serviceLikeDislike2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(serviceLikeDislike);
        expect(expectedResult).toContain(serviceLikeDislike2);
      });

      it('should accept null and undefined values', () => {
        const serviceLikeDislike: IServiceLikeDislike = { id: 123 };
        expectedResult = service.addServiceLikeDislikeToCollectionIfMissing([], null, serviceLikeDislike, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(serviceLikeDislike);
      });

      it('should return initial array if no ServiceLikeDislike is added', () => {
        const serviceLikeDislikeCollection: IServiceLikeDislike[] = [{ id: 123 }];
        expectedResult = service.addServiceLikeDislikeToCollectionIfMissing(serviceLikeDislikeCollection, undefined, null);
        expect(expectedResult).toEqual(serviceLikeDislikeCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
