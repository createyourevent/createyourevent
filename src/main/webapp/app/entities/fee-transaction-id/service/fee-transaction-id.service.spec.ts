import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IFeeTransactionId, FeeTransactionId } from '../fee-transaction-id.model';

import { FeeTransactionIdService } from './fee-transaction-id.service';

describe('FeeTransactionId Service', () => {
  let service: FeeTransactionIdService;
  let httpMock: HttpTestingController;
  let elemDefault: IFeeTransactionId;
  let expectedResult: IFeeTransactionId | IFeeTransactionId[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(FeeTransactionIdService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      transactionId: 'AAAAAAA',
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

    it('should create a FeeTransactionId', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new FeeTransactionId()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a FeeTransactionId', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          transactionId: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a FeeTransactionId', () => {
      const patchObject = Object.assign({}, new FeeTransactionId());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of FeeTransactionId', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          transactionId: 'BBBBBB',
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

    it('should delete a FeeTransactionId', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addFeeTransactionIdToCollectionIfMissing', () => {
      it('should add a FeeTransactionId to an empty array', () => {
        const feeTransactionId: IFeeTransactionId = { id: 123 };
        expectedResult = service.addFeeTransactionIdToCollectionIfMissing([], feeTransactionId);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(feeTransactionId);
      });

      it('should not add a FeeTransactionId to an array that contains it', () => {
        const feeTransactionId: IFeeTransactionId = { id: 123 };
        const feeTransactionIdCollection: IFeeTransactionId[] = [
          {
            ...feeTransactionId,
          },
          { id: 456 },
        ];
        expectedResult = service.addFeeTransactionIdToCollectionIfMissing(feeTransactionIdCollection, feeTransactionId);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a FeeTransactionId to an array that doesn't contain it", () => {
        const feeTransactionId: IFeeTransactionId = { id: 123 };
        const feeTransactionIdCollection: IFeeTransactionId[] = [{ id: 456 }];
        expectedResult = service.addFeeTransactionIdToCollectionIfMissing(feeTransactionIdCollection, feeTransactionId);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(feeTransactionId);
      });

      it('should add only unique FeeTransactionId to an array', () => {
        const feeTransactionIdArray: IFeeTransactionId[] = [{ id: 123 }, { id: 456 }, { id: 79619 }];
        const feeTransactionIdCollection: IFeeTransactionId[] = [{ id: 123 }];
        expectedResult = service.addFeeTransactionIdToCollectionIfMissing(feeTransactionIdCollection, ...feeTransactionIdArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const feeTransactionId: IFeeTransactionId = { id: 123 };
        const feeTransactionId2: IFeeTransactionId = { id: 456 };
        expectedResult = service.addFeeTransactionIdToCollectionIfMissing([], feeTransactionId, feeTransactionId2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(feeTransactionId);
        expect(expectedResult).toContain(feeTransactionId2);
      });

      it('should accept null and undefined values', () => {
        const feeTransactionId: IFeeTransactionId = { id: 123 };
        expectedResult = service.addFeeTransactionIdToCollectionIfMissing([], null, feeTransactionId, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(feeTransactionId);
      });

      it('should return initial array if no FeeTransactionId is added', () => {
        const feeTransactionIdCollection: IFeeTransactionId[] = [{ id: 123 }];
        expectedResult = service.addFeeTransactionIdToCollectionIfMissing(feeTransactionIdCollection, undefined, null);
        expect(expectedResult).toEqual(feeTransactionIdCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
