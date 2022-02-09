import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IOrganizationComment, OrganizationComment } from '../organization-comment.model';

import { OrganizationCommentService } from './organization-comment.service';

describe('OrganizationComment Service', () => {
  let service: OrganizationCommentService;
  let httpMock: HttpTestingController;
  let elemDefault: IOrganizationComment;
  let expectedResult: IOrganizationComment | IOrganizationComment[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(OrganizationCommentService);
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

    it('should create a OrganizationComment', () => {
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

      service.create(new OrganizationComment()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a OrganizationComment', () => {
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

    it('should partial update a OrganizationComment', () => {
      const patchObject = Object.assign(
        {
          comment: 'BBBBBB',
        },
        new OrganizationComment()
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

    it('should return a list of OrganizationComment', () => {
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

    it('should delete a OrganizationComment', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addOrganizationCommentToCollectionIfMissing', () => {
      it('should add a OrganizationComment to an empty array', () => {
        const organizationComment: IOrganizationComment = { id: 123 };
        expectedResult = service.addOrganizationCommentToCollectionIfMissing([], organizationComment);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(organizationComment);
      });

      it('should not add a OrganizationComment to an array that contains it', () => {
        const organizationComment: IOrganizationComment = { id: 123 };
        const organizationCommentCollection: IOrganizationComment[] = [
          {
            ...organizationComment,
          },
          { id: 456 },
        ];
        expectedResult = service.addOrganizationCommentToCollectionIfMissing(organizationCommentCollection, organizationComment);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a OrganizationComment to an array that doesn't contain it", () => {
        const organizationComment: IOrganizationComment = { id: 123 };
        const organizationCommentCollection: IOrganizationComment[] = [{ id: 456 }];
        expectedResult = service.addOrganizationCommentToCollectionIfMissing(organizationCommentCollection, organizationComment);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(organizationComment);
      });

      it('should add only unique OrganizationComment to an array', () => {
        const organizationCommentArray: IOrganizationComment[] = [{ id: 123 }, { id: 456 }, { id: 54884 }];
        const organizationCommentCollection: IOrganizationComment[] = [{ id: 123 }];
        expectedResult = service.addOrganizationCommentToCollectionIfMissing(organizationCommentCollection, ...organizationCommentArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const organizationComment: IOrganizationComment = { id: 123 };
        const organizationComment2: IOrganizationComment = { id: 456 };
        expectedResult = service.addOrganizationCommentToCollectionIfMissing([], organizationComment, organizationComment2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(organizationComment);
        expect(expectedResult).toContain(organizationComment2);
      });

      it('should accept null and undefined values', () => {
        const organizationComment: IOrganizationComment = { id: 123 };
        expectedResult = service.addOrganizationCommentToCollectionIfMissing([], null, organizationComment, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(organizationComment);
      });

      it('should return initial array if no OrganizationComment is added', () => {
        const organizationCommentCollection: IOrganizationComment[] = [{ id: 123 }];
        expectedResult = service.addOrganizationCommentToCollectionIfMissing(organizationCommentCollection, undefined, null);
        expect(expectedResult).toEqual(organizationCommentCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
