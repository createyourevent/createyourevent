import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IOrganizationStarRating, OrganizationStarRating } from '../organization-star-rating.model';

import { OrganizationStarRatingService } from './organization-star-rating.service';

describe('OrganizationStarRating Service', () => {
  let service: OrganizationStarRatingService;
  let httpMock: HttpTestingController;
  let elemDefault: IOrganizationStarRating;
  let expectedResult: IOrganizationStarRating | IOrganizationStarRating[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(OrganizationStarRatingService);
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

    it('should create a OrganizationStarRating', () => {
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

      service.create(new OrganizationStarRating()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a OrganizationStarRating', () => {
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

    it('should partial update a OrganizationStarRating', () => {
      const patchObject = Object.assign(
        {
          comment: 'BBBBBB',
        },
        new OrganizationStarRating()
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

    it('should return a list of OrganizationStarRating', () => {
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

    it('should delete a OrganizationStarRating', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addOrganizationStarRatingToCollectionIfMissing', () => {
      it('should add a OrganizationStarRating to an empty array', () => {
        const organizationStarRating: IOrganizationStarRating = { id: 123 };
        expectedResult = service.addOrganizationStarRatingToCollectionIfMissing([], organizationStarRating);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(organizationStarRating);
      });

      it('should not add a OrganizationStarRating to an array that contains it', () => {
        const organizationStarRating: IOrganizationStarRating = { id: 123 };
        const organizationStarRatingCollection: IOrganizationStarRating[] = [
          {
            ...organizationStarRating,
          },
          { id: 456 },
        ];
        expectedResult = service.addOrganizationStarRatingToCollectionIfMissing(organizationStarRatingCollection, organizationStarRating);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a OrganizationStarRating to an array that doesn't contain it", () => {
        const organizationStarRating: IOrganizationStarRating = { id: 123 };
        const organizationStarRatingCollection: IOrganizationStarRating[] = [{ id: 456 }];
        expectedResult = service.addOrganizationStarRatingToCollectionIfMissing(organizationStarRatingCollection, organizationStarRating);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(organizationStarRating);
      });

      it('should add only unique OrganizationStarRating to an array', () => {
        const organizationStarRatingArray: IOrganizationStarRating[] = [{ id: 123 }, { id: 456 }, { id: 55563 }];
        const organizationStarRatingCollection: IOrganizationStarRating[] = [{ id: 123 }];
        expectedResult = service.addOrganizationStarRatingToCollectionIfMissing(
          organizationStarRatingCollection,
          ...organizationStarRatingArray
        );
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const organizationStarRating: IOrganizationStarRating = { id: 123 };
        const organizationStarRating2: IOrganizationStarRating = { id: 456 };
        expectedResult = service.addOrganizationStarRatingToCollectionIfMissing([], organizationStarRating, organizationStarRating2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(organizationStarRating);
        expect(expectedResult).toContain(organizationStarRating2);
      });

      it('should accept null and undefined values', () => {
        const organizationStarRating: IOrganizationStarRating = { id: 123 };
        expectedResult = service.addOrganizationStarRatingToCollectionIfMissing([], null, organizationStarRating, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(organizationStarRating);
      });

      it('should return initial array if no OrganizationStarRating is added', () => {
        const organizationStarRatingCollection: IOrganizationStarRating[] = [{ id: 123 }];
        expectedResult = service.addOrganizationStarRatingToCollectionIfMissing(organizationStarRatingCollection, undefined, null);
        expect(expectedResult).toEqual(organizationStarRatingCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
