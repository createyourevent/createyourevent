import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IBond, Bond } from '../bond.model';

import { BondService } from './bond.service';

describe('Bond Service', () => {
  let service: BondService;
  let httpMock: HttpTestingController;
  let elemDefault: IBond;
  let expectedResult: IBond | IBond[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(BondService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      name: 'AAAAAAA',
      description: 'AAAAAAA',
      code: 'AAAAAAA',
      points: 0,
      creationDate: currentDate,
      redemptionDate: currentDate,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          creationDate: currentDate.format(DATE_TIME_FORMAT),
          redemptionDate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Bond', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          creationDate: currentDate.format(DATE_TIME_FORMAT),
          redemptionDate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          creationDate: currentDate,
          redemptionDate: currentDate,
        },
        returnedFromService
      );

      service.create(new Bond()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Bond', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          description: 'BBBBBB',
          code: 'BBBBBB',
          points: 1,
          creationDate: currentDate.format(DATE_TIME_FORMAT),
          redemptionDate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          creationDate: currentDate,
          redemptionDate: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Bond', () => {
      const patchObject = Object.assign(
        {
          name: 'BBBBBB',
          description: 'BBBBBB',
          code: 'BBBBBB',
          points: 1,
        },
        new Bond()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          creationDate: currentDate,
          redemptionDate: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Bond', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          description: 'BBBBBB',
          code: 'BBBBBB',
          points: 1,
          creationDate: currentDate.format(DATE_TIME_FORMAT),
          redemptionDate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          creationDate: currentDate,
          redemptionDate: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Bond', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addBondToCollectionIfMissing', () => {
      it('should add a Bond to an empty array', () => {
        const bond: IBond = { id: 123 };
        expectedResult = service.addBondToCollectionIfMissing([], bond);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(bond);
      });

      it('should not add a Bond to an array that contains it', () => {
        const bond: IBond = { id: 123 };
        const bondCollection: IBond[] = [
          {
            ...bond,
          },
          { id: 456 },
        ];
        expectedResult = service.addBondToCollectionIfMissing(bondCollection, bond);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Bond to an array that doesn't contain it", () => {
        const bond: IBond = { id: 123 };
        const bondCollection: IBond[] = [{ id: 456 }];
        expectedResult = service.addBondToCollectionIfMissing(bondCollection, bond);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(bond);
      });

      it('should add only unique Bond to an array', () => {
        const bondArray: IBond[] = [{ id: 123 }, { id: 456 }, { id: 40497 }];
        const bondCollection: IBond[] = [{ id: 123 }];
        expectedResult = service.addBondToCollectionIfMissing(bondCollection, ...bondArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const bond: IBond = { id: 123 };
        const bond2: IBond = { id: 456 };
        expectedResult = service.addBondToCollectionIfMissing([], bond, bond2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(bond);
        expect(expectedResult).toContain(bond2);
      });

      it('should accept null and undefined values', () => {
        const bond: IBond = { id: 123 };
        expectedResult = service.addBondToCollectionIfMissing([], null, bond, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(bond);
      });

      it('should return initial array if no Bond is added', () => {
        const bondCollection: IBond[] = [{ id: 123 }];
        expectedResult = service.addBondToCollectionIfMissing(bondCollection, undefined, null);
        expect(expectedResult).toEqual(bondCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
