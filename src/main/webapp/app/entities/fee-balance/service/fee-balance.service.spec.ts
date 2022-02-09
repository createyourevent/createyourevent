import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { FeeType } from 'app/entities/enumerations/fee-type.model';
import { IFeeBalance, FeeBalance } from '../fee-balance.model';

import { FeeBalanceService } from './fee-balance.service';

describe('FeeBalance Service', () => {
  let service: FeeBalanceService;
  let httpMock: HttpTestingController;
  let elemDefault: IFeeBalance;
  let expectedResult: IFeeBalance | IFeeBalance[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(FeeBalanceService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      date: currentDate,
      type: FeeType.EVENT,
      total: 0,
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

    it('should create a FeeBalance', () => {
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

      service.create(new FeeBalance()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a FeeBalance', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          date: currentDate.format(DATE_TIME_FORMAT),
          type: 'BBBBBB',
          total: 1,
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

    it('should partial update a FeeBalance', () => {
      const patchObject = Object.assign(
        {
          total: 1,
        },
        new FeeBalance()
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

    it('should return a list of FeeBalance', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          date: currentDate.format(DATE_TIME_FORMAT),
          type: 'BBBBBB',
          total: 1,
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

    it('should delete a FeeBalance', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addFeeBalanceToCollectionIfMissing', () => {
      it('should add a FeeBalance to an empty array', () => {
        const feeBalance: IFeeBalance = { id: 123 };
        expectedResult = service.addFeeBalanceToCollectionIfMissing([], feeBalance);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(feeBalance);
      });

      it('should not add a FeeBalance to an array that contains it', () => {
        const feeBalance: IFeeBalance = { id: 123 };
        const feeBalanceCollection: IFeeBalance[] = [
          {
            ...feeBalance,
          },
          { id: 456 },
        ];
        expectedResult = service.addFeeBalanceToCollectionIfMissing(feeBalanceCollection, feeBalance);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a FeeBalance to an array that doesn't contain it", () => {
        const feeBalance: IFeeBalance = { id: 123 };
        const feeBalanceCollection: IFeeBalance[] = [{ id: 456 }];
        expectedResult = service.addFeeBalanceToCollectionIfMissing(feeBalanceCollection, feeBalance);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(feeBalance);
      });

      it('should add only unique FeeBalance to an array', () => {
        const feeBalanceArray: IFeeBalance[] = [{ id: 123 }, { id: 456 }, { id: 75258 }];
        const feeBalanceCollection: IFeeBalance[] = [{ id: 123 }];
        expectedResult = service.addFeeBalanceToCollectionIfMissing(feeBalanceCollection, ...feeBalanceArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const feeBalance: IFeeBalance = { id: 123 };
        const feeBalance2: IFeeBalance = { id: 456 };
        expectedResult = service.addFeeBalanceToCollectionIfMissing([], feeBalance, feeBalance2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(feeBalance);
        expect(expectedResult).toContain(feeBalance2);
      });

      it('should accept null and undefined values', () => {
        const feeBalance: IFeeBalance = { id: 123 };
        expectedResult = service.addFeeBalanceToCollectionIfMissing([], null, feeBalance, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(feeBalance);
      });

      it('should return initial array if no FeeBalance is added', () => {
        const feeBalanceCollection: IFeeBalance[] = [{ id: 123 }];
        expectedResult = service.addFeeBalanceToCollectionIfMissing(feeBalanceCollection, undefined, null);
        expect(expectedResult).toEqual(feeBalanceCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
