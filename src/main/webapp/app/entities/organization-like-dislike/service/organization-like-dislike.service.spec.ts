import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IOrganizationLikeDislike, OrganizationLikeDislike } from '../organization-like-dislike.model';

import { OrganizationLikeDislikeService } from './organization-like-dislike.service';

describe('OrganizationLikeDislike Service', () => {
  let service: OrganizationLikeDislikeService;
  let httpMock: HttpTestingController;
  let elemDefault: IOrganizationLikeDislike;
  let expectedResult: IOrganizationLikeDislike | IOrganizationLikeDislike[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(OrganizationLikeDislikeService);
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

    it('should create a OrganizationLikeDislike', () => {
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

      service.create(new OrganizationLikeDislike()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a OrganizationLikeDislike', () => {
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

    it('should partial update a OrganizationLikeDislike', () => {
      const patchObject = Object.assign(
        {
          like: 1,
          dislike: 1,
          comment: 'BBBBBB',
        },
        new OrganizationLikeDislike()
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

    it('should return a list of OrganizationLikeDislike', () => {
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

    it('should delete a OrganizationLikeDislike', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addOrganizationLikeDislikeToCollectionIfMissing', () => {
      it('should add a OrganizationLikeDislike to an empty array', () => {
        const organizationLikeDislike: IOrganizationLikeDislike = { id: 123 };
        expectedResult = service.addOrganizationLikeDislikeToCollectionIfMissing([], organizationLikeDislike);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(organizationLikeDislike);
      });

      it('should not add a OrganizationLikeDislike to an array that contains it', () => {
        const organizationLikeDislike: IOrganizationLikeDislike = { id: 123 };
        const organizationLikeDislikeCollection: IOrganizationLikeDislike[] = [
          {
            ...organizationLikeDislike,
          },
          { id: 456 },
        ];
        expectedResult = service.addOrganizationLikeDislikeToCollectionIfMissing(
          organizationLikeDislikeCollection,
          organizationLikeDislike
        );
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a OrganizationLikeDislike to an array that doesn't contain it", () => {
        const organizationLikeDislike: IOrganizationLikeDislike = { id: 123 };
        const organizationLikeDislikeCollection: IOrganizationLikeDislike[] = [{ id: 456 }];
        expectedResult = service.addOrganizationLikeDislikeToCollectionIfMissing(
          organizationLikeDislikeCollection,
          organizationLikeDislike
        );
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(organizationLikeDislike);
      });

      it('should add only unique OrganizationLikeDislike to an array', () => {
        const organizationLikeDislikeArray: IOrganizationLikeDislike[] = [{ id: 123 }, { id: 456 }, { id: 47476 }];
        const organizationLikeDislikeCollection: IOrganizationLikeDislike[] = [{ id: 123 }];
        expectedResult = service.addOrganizationLikeDislikeToCollectionIfMissing(
          organizationLikeDislikeCollection,
          ...organizationLikeDislikeArray
        );
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const organizationLikeDislike: IOrganizationLikeDislike = { id: 123 };
        const organizationLikeDislike2: IOrganizationLikeDislike = { id: 456 };
        expectedResult = service.addOrganizationLikeDislikeToCollectionIfMissing([], organizationLikeDislike, organizationLikeDislike2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(organizationLikeDislike);
        expect(expectedResult).toContain(organizationLikeDislike2);
      });

      it('should accept null and undefined values', () => {
        const organizationLikeDislike: IOrganizationLikeDislike = { id: 123 };
        expectedResult = service.addOrganizationLikeDislikeToCollectionIfMissing([], null, organizationLikeDislike, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(organizationLikeDislike);
      });

      it('should return initial array if no OrganizationLikeDislike is added', () => {
        const organizationLikeDislikeCollection: IOrganizationLikeDislike[] = [{ id: 123 }];
        expectedResult = service.addOrganizationLikeDislikeToCollectionIfMissing(organizationLikeDislikeCollection, undefined, null);
        expect(expectedResult).toEqual(organizationLikeDislikeCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
