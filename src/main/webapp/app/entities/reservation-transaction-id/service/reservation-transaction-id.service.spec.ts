import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IReservationTransactionId, ReservationTransactionId } from '../reservation-transaction-id.model';

import { ReservationTransactionIdService } from './reservation-transaction-id.service';

describe('ReservationTransactionId Service', () => {
  let service: ReservationTransactionIdService;
  let httpMock: HttpTestingController;
  let elemDefault: IReservationTransactionId;
  let expectedResult: IReservationTransactionId | IReservationTransactionId[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ReservationTransactionIdService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      transactionDepositId: 'AAAAAAA',
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

    it('should create a ReservationTransactionId', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new ReservationTransactionId()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ReservationTransactionId', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          transactionDepositId: 'BBBBBB',
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

    it('should partial update a ReservationTransactionId', () => {
      const patchObject = Object.assign(
        {
          transactionDepositId: 'BBBBBB',
        },
        new ReservationTransactionId()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ReservationTransactionId', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          transactionDepositId: 'BBBBBB',
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

    it('should delete a ReservationTransactionId', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addReservationTransactionIdToCollectionIfMissing', () => {
      it('should add a ReservationTransactionId to an empty array', () => {
        const reservationTransactionId: IReservationTransactionId = { id: 123 };
        expectedResult = service.addReservationTransactionIdToCollectionIfMissing([], reservationTransactionId);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(reservationTransactionId);
      });

      it('should not add a ReservationTransactionId to an array that contains it', () => {
        const reservationTransactionId: IReservationTransactionId = { id: 123 };
        const reservationTransactionIdCollection: IReservationTransactionId[] = [
          {
            ...reservationTransactionId,
          },
          { id: 456 },
        ];
        expectedResult = service.addReservationTransactionIdToCollectionIfMissing(
          reservationTransactionIdCollection,
          reservationTransactionId
        );
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ReservationTransactionId to an array that doesn't contain it", () => {
        const reservationTransactionId: IReservationTransactionId = { id: 123 };
        const reservationTransactionIdCollection: IReservationTransactionId[] = [{ id: 456 }];
        expectedResult = service.addReservationTransactionIdToCollectionIfMissing(
          reservationTransactionIdCollection,
          reservationTransactionId
        );
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(reservationTransactionId);
      });

      it('should add only unique ReservationTransactionId to an array', () => {
        const reservationTransactionIdArray: IReservationTransactionId[] = [{ id: 123 }, { id: 456 }, { id: 92726 }];
        const reservationTransactionIdCollection: IReservationTransactionId[] = [{ id: 123 }];
        expectedResult = service.addReservationTransactionIdToCollectionIfMissing(
          reservationTransactionIdCollection,
          ...reservationTransactionIdArray
        );
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const reservationTransactionId: IReservationTransactionId = { id: 123 };
        const reservationTransactionId2: IReservationTransactionId = { id: 456 };
        expectedResult = service.addReservationTransactionIdToCollectionIfMissing([], reservationTransactionId, reservationTransactionId2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(reservationTransactionId);
        expect(expectedResult).toContain(reservationTransactionId2);
      });

      it('should accept null and undefined values', () => {
        const reservationTransactionId: IReservationTransactionId = { id: 123 };
        expectedResult = service.addReservationTransactionIdToCollectionIfMissing([], null, reservationTransactionId, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(reservationTransactionId);
      });

      it('should return initial array if no ReservationTransactionId is added', () => {
        const reservationTransactionIdCollection: IReservationTransactionId[] = [{ id: 123 }];
        expectedResult = service.addReservationTransactionIdToCollectionIfMissing(reservationTransactionIdCollection, undefined, null);
        expect(expectedResult).toEqual(reservationTransactionIdCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
