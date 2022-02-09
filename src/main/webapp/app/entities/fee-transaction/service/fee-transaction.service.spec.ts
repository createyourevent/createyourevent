import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IFeeTransaction, FeeTransaction } from '../fee-transaction.model';

import { FeeTransactionService } from './fee-transaction.service';

describe('FeeTransaction Service', () => {
  let service: FeeTransactionService;
  let httpMock: HttpTestingController;
  let elemDefault: IFeeTransaction;
  let expectedResult: IFeeTransaction | IFeeTransaction[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(FeeTransactionService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
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

    it('should create a FeeTransaction', () => {
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

      service.create(new FeeTransaction()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a FeeTransaction', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
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

    it('should partial update a FeeTransaction', () => {
      const patchObject = Object.assign(
        {
          date: currentDate.format(DATE_TIME_FORMAT),
        },
        new FeeTransaction()
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

    it('should return a list of FeeTransaction', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
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

    it('should delete a FeeTransaction', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addFeeTransactionToCollectionIfMissing', () => {
      it('should add a FeeTransaction to an empty array', () => {
        const feeTransaction: IFeeTransaction = { id: 123 };
        expectedResult = service.addFeeTransactionToCollectionIfMissing([], feeTransaction);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(feeTransaction);
      });

      it('should not add a FeeTransaction to an array that contains it', () => {
        const feeTransaction: IFeeTransaction = { id: 123 };
        const feeTransactionCollection: IFeeTransaction[] = [
          {
            ...feeTransaction,
          },
          { id: 456 },
        ];
        expectedResult = service.addFeeTransactionToCollectionIfMissing(feeTransactionCollection, feeTransaction);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a FeeTransaction to an array that doesn't contain it", () => {
        const feeTransaction: IFeeTransaction = { id: 123 };
        const feeTransactionCollection: IFeeTransaction[] = [{ id: 456 }];
        expectedResult = service.addFeeTransactionToCollectionIfMissing(feeTransactionCollection, feeTransaction);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(feeTransaction);
      });

      it('should add only unique FeeTransaction to an array', () => {
        const feeTransactionArray: IFeeTransaction[] = [{ id: 123 }, { id: 456 }, { id: 97469 }];
        const feeTransactionCollection: IFeeTransaction[] = [{ id: 123 }];
        expectedResult = service.addFeeTransactionToCollectionIfMissing(feeTransactionCollection, ...feeTransactionArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const feeTransaction: IFeeTransaction = { id: 123 };
        const feeTransaction2: IFeeTransaction = { id: 456 };
        expectedResult = service.addFeeTransactionToCollectionIfMissing([], feeTransaction, feeTransaction2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(feeTransaction);
        expect(expectedResult).toContain(feeTransaction2);
      });

      it('should accept null and undefined values', () => {
        const feeTransaction: IFeeTransaction = { id: 123 };
        expectedResult = service.addFeeTransactionToCollectionIfMissing([], null, feeTransaction, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(feeTransaction);
      });

      it('should return initial array if no FeeTransaction is added', () => {
        const feeTransactionCollection: IFeeTransaction[] = [{ id: 123 }];
        expectedResult = service.addFeeTransactionToCollectionIfMissing(feeTransactionCollection, undefined, null);
        expect(expectedResult).toEqual(feeTransactionCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
