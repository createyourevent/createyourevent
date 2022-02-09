import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IOrganizationReservation, OrganizationReservation } from '../organization-reservation.model';

import { OrganizationReservationService } from './organization-reservation.service';

describe('OrganizationReservation Service', () => {
  let service: OrganizationReservationService;
  let httpMock: HttpTestingController;
  let elemDefault: IOrganizationReservation;
  let expectedResult: IOrganizationReservation | IOrganizationReservation[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(OrganizationReservationService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      date: currentDate,
      dateFrom: currentDate,
      dateUntil: currentDate,
      seen: false,
      approved: false,
      total: 0,
      feeBilled: false,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          date: currentDate.format(DATE_TIME_FORMAT),
          dateFrom: currentDate.format(DATE_TIME_FORMAT),
          dateUntil: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a OrganizationReservation', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          date: currentDate.format(DATE_TIME_FORMAT),
          dateFrom: currentDate.format(DATE_TIME_FORMAT),
          dateUntil: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          date: currentDate,
          dateFrom: currentDate,
          dateUntil: currentDate,
        },
        returnedFromService
      );

      service.create(new OrganizationReservation()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a OrganizationReservation', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          date: currentDate.format(DATE_TIME_FORMAT),
          dateFrom: currentDate.format(DATE_TIME_FORMAT),
          dateUntil: currentDate.format(DATE_TIME_FORMAT),
          seen: true,
          approved: true,
          total: 1,
          feeBilled: true,
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          date: currentDate,
          dateFrom: currentDate,
          dateUntil: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a OrganizationReservation', () => {
      const patchObject = Object.assign(
        {
          date: currentDate.format(DATE_TIME_FORMAT),
          dateFrom: currentDate.format(DATE_TIME_FORMAT),
          seen: true,
          approved: true,
        },
        new OrganizationReservation()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          date: currentDate,
          dateFrom: currentDate,
          dateUntil: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of OrganizationReservation', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          date: currentDate.format(DATE_TIME_FORMAT),
          dateFrom: currentDate.format(DATE_TIME_FORMAT),
          dateUntil: currentDate.format(DATE_TIME_FORMAT),
          seen: true,
          approved: true,
          total: 1,
          feeBilled: true,
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          date: currentDate,
          dateFrom: currentDate,
          dateUntil: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a OrganizationReservation', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addOrganizationReservationToCollectionIfMissing', () => {
      it('should add a OrganizationReservation to an empty array', () => {
        const organizationReservation: IOrganizationReservation = { id: 123 };
        expectedResult = service.addOrganizationReservationToCollectionIfMissing([], organizationReservation);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(organizationReservation);
      });

      it('should not add a OrganizationReservation to an array that contains it', () => {
        const organizationReservation: IOrganizationReservation = { id: 123 };
        const organizationReservationCollection: IOrganizationReservation[] = [
          {
            ...organizationReservation,
          },
          { id: 456 },
        ];
        expectedResult = service.addOrganizationReservationToCollectionIfMissing(
          organizationReservationCollection,
          organizationReservation
        );
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a OrganizationReservation to an array that doesn't contain it", () => {
        const organizationReservation: IOrganizationReservation = { id: 123 };
        const organizationReservationCollection: IOrganizationReservation[] = [{ id: 456 }];
        expectedResult = service.addOrganizationReservationToCollectionIfMissing(
          organizationReservationCollection,
          organizationReservation
        );
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(organizationReservation);
      });

      it('should add only unique OrganizationReservation to an array', () => {
        const organizationReservationArray: IOrganizationReservation[] = [{ id: 123 }, { id: 456 }, { id: 14659 }];
        const organizationReservationCollection: IOrganizationReservation[] = [{ id: 123 }];
        expectedResult = service.addOrganizationReservationToCollectionIfMissing(
          organizationReservationCollection,
          ...organizationReservationArray
        );
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const organizationReservation: IOrganizationReservation = { id: 123 };
        const organizationReservation2: IOrganizationReservation = { id: 456 };
        expectedResult = service.addOrganizationReservationToCollectionIfMissing([], organizationReservation, organizationReservation2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(organizationReservation);
        expect(expectedResult).toContain(organizationReservation2);
      });

      it('should accept null and undefined values', () => {
        const organizationReservation: IOrganizationReservation = { id: 123 };
        expectedResult = service.addOrganizationReservationToCollectionIfMissing([], null, organizationReservation, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(organizationReservation);
      });

      it('should return initial array if no OrganizationReservation is added', () => {
        const organizationReservationCollection: IOrganizationReservation[] = [{ id: 123 }];
        expectedResult = service.addOrganizationReservationToCollectionIfMissing(organizationReservationCollection, undefined, null);
        expect(expectedResult).toEqual(organizationReservationCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
