import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { FeeType } from 'app/entities/enumerations/fee-type.model';
import { IFeeTransactionEntry, FeeTransactionEntry } from '../fee-transaction-entry.model';

import { FeeTransactionEntryService } from './fee-transaction-entry.service';

describe('FeeTransactionEntry Service', () => {
  let service: FeeTransactionEntryService;
  let httpMock: HttpTestingController;
  let elemDefault: IFeeTransactionEntry;
  let expectedResult: IFeeTransactionEntry | IFeeTransactionEntry[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(FeeTransactionEntryService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      type: FeeType.EVENT,
      value: 0,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a FeeTransactionEntry', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new FeeTransactionEntry()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a FeeTransactionEntry', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          type: 'BBBBBB',
          value: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a FeeTransactionEntry', () => {
      const patchObject = Object.assign(
        {
          type: 'BBBBBB',
        },
        new FeeTransactionEntry()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of FeeTransactionEntry', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          type: 'BBBBBB',
          value: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a FeeTransactionEntry', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addFeeTransactionEntryToCollectionIfMissing', () => {
      it('should add a FeeTransactionEntry to an empty array', () => {
        const feeTransactionEntry: IFeeTransactionEntry = { id: 123 };
        expectedResult = service.addFeeTransactionEntryToCollectionIfMissing([], feeTransactionEntry);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(feeTransactionEntry);
      });

      it('should not add a FeeTransactionEntry to an array that contains it', () => {
        const feeTransactionEntry: IFeeTransactionEntry = { id: 123 };
        const feeTransactionEntryCollection: IFeeTransactionEntry[] = [
          {
            ...feeTransactionEntry,
          },
          { id: 456 },
        ];
        expectedResult = service.addFeeTransactionEntryToCollectionIfMissing(feeTransactionEntryCollection, feeTransactionEntry);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a FeeTransactionEntry to an array that doesn't contain it", () => {
        const feeTransactionEntry: IFeeTransactionEntry = { id: 123 };
        const feeTransactionEntryCollection: IFeeTransactionEntry[] = [{ id: 456 }];
        expectedResult = service.addFeeTransactionEntryToCollectionIfMissing(feeTransactionEntryCollection, feeTransactionEntry);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(feeTransactionEntry);
      });

      it('should add only unique FeeTransactionEntry to an array', () => {
        const feeTransactionEntryArray: IFeeTransactionEntry[] = [{ id: 123 }, { id: 456 }, { id: 53284 }];
        const feeTransactionEntryCollection: IFeeTransactionEntry[] = [{ id: 123 }];
        expectedResult = service.addFeeTransactionEntryToCollectionIfMissing(feeTransactionEntryCollection, ...feeTransactionEntryArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const feeTransactionEntry: IFeeTransactionEntry = { id: 123 };
        const feeTransactionEntry2: IFeeTransactionEntry = { id: 456 };
        expectedResult = service.addFeeTransactionEntryToCollectionIfMissing([], feeTransactionEntry, feeTransactionEntry2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(feeTransactionEntry);
        expect(expectedResult).toContain(feeTransactionEntry2);
      });

      it('should accept null and undefined values', () => {
        const feeTransactionEntry: IFeeTransactionEntry = { id: 123 };
        expectedResult = service.addFeeTransactionEntryToCollectionIfMissing([], null, feeTransactionEntry, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(feeTransactionEntry);
      });

      it('should return initial array if no FeeTransactionEntry is added', () => {
        const feeTransactionEntryCollection: IFeeTransactionEntry[] = [{ id: 123 }];
        expectedResult = service.addFeeTransactionEntryToCollectionIfMissing(feeTransactionEntryCollection, undefined, null);
        expect(expectedResult).toEqual(feeTransactionEntryCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
