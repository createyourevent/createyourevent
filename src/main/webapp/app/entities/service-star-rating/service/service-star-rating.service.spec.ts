import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IServiceStarRating, ServiceStarRating } from '../service-star-rating.model';

import { ServiceStarRatingService } from './service-star-rating.service';

describe('ServiceStarRating Service', () => {
  let service: ServiceStarRatingService;
  let httpMock: HttpTestingController;
  let elemDefault: IServiceStarRating;
  let expectedResult: IServiceStarRating | IServiceStarRating[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ServiceStarRatingService);
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

    it('should create a ServiceStarRating', () => {
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

      service.create(new ServiceStarRating()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ServiceStarRating', () => {
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

    it('should partial update a ServiceStarRating', () => {
      const patchObject = Object.assign(
        {
          comment: 'BBBBBB',
        },
        new ServiceStarRating()
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

    it('should return a list of ServiceStarRating', () => {
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

    it('should delete a ServiceStarRating', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addServiceStarRatingToCollectionIfMissing', () => {
      it('should add a ServiceStarRating to an empty array', () => {
        const serviceStarRating: IServiceStarRating = { id: 123 };
        expectedResult = service.addServiceStarRatingToCollectionIfMissing([], serviceStarRating);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(serviceStarRating);
      });

      it('should not add a ServiceStarRating to an array that contains it', () => {
        const serviceStarRating: IServiceStarRating = { id: 123 };
        const serviceStarRatingCollection: IServiceStarRating[] = [
          {
            ...serviceStarRating,
          },
          { id: 456 },
        ];
        expectedResult = service.addServiceStarRatingToCollectionIfMissing(serviceStarRatingCollection, serviceStarRating);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ServiceStarRating to an array that doesn't contain it", () => {
        const serviceStarRating: IServiceStarRating = { id: 123 };
        const serviceStarRatingCollection: IServiceStarRating[] = [{ id: 456 }];
        expectedResult = service.addServiceStarRatingToCollectionIfMissing(serviceStarRatingCollection, serviceStarRating);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(serviceStarRating);
      });

      it('should add only unique ServiceStarRating to an array', () => {
        const serviceStarRatingArray: IServiceStarRating[] = [{ id: 123 }, { id: 456 }, { id: 61610 }];
        const serviceStarRatingCollection: IServiceStarRating[] = [{ id: 123 }];
        expectedResult = service.addServiceStarRatingToCollectionIfMissing(serviceStarRatingCollection, ...serviceStarRatingArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const serviceStarRating: IServiceStarRating = { id: 123 };
        const serviceStarRating2: IServiceStarRating = { id: 456 };
        expectedResult = service.addServiceStarRatingToCollectionIfMissing([], serviceStarRating, serviceStarRating2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(serviceStarRating);
        expect(expectedResult).toContain(serviceStarRating2);
      });

      it('should accept null and undefined values', () => {
        const serviceStarRating: IServiceStarRating = { id: 123 };
        expectedResult = service.addServiceStarRatingToCollectionIfMissing([], null, serviceStarRating, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(serviceStarRating);
      });

      it('should return initial array if no ServiceStarRating is added', () => {
        const serviceStarRatingCollection: IServiceStarRating[] = [{ id: 123 }];
        expectedResult = service.addServiceStarRatingToCollectionIfMissing(serviceStarRatingCollection, undefined, null);
        expect(expectedResult).toEqual(serviceStarRatingCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
