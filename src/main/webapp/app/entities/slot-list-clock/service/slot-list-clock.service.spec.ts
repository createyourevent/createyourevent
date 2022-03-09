import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ISlotListClock, SlotListClock } from '../slot-list-clock.model';

import { SlotListClockService } from './slot-list-clock.service';

describe('SlotListClock Service', () => {
  let service: SlotListClockService;
  let httpMock: HttpTestingController;
  let elemDefault: ISlotListClock;
  let expectedResult: ISlotListClock | ISlotListClock[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SlotListClockService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      coupons: 'AAAAAAA',
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

    it('should create a SlotListClock', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new SlotListClock()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a SlotListClock', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          coupons: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a SlotListClock', () => {
      const patchObject = Object.assign(
        {
          coupons: 'BBBBBB',
        },
        new SlotListClock()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of SlotListClock', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          coupons: 'BBBBBB',
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

    it('should delete a SlotListClock', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addSlotListClockToCollectionIfMissing', () => {
      it('should add a SlotListClock to an empty array', () => {
        const slotListClock: ISlotListClock = { id: 123 };
        expectedResult = service.addSlotListClockToCollectionIfMissing([], slotListClock);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(slotListClock);
      });

      it('should not add a SlotListClock to an array that contains it', () => {
        const slotListClock: ISlotListClock = { id: 123 };
        const slotListClockCollection: ISlotListClock[] = [
          {
            ...slotListClock,
          },
          { id: 456 },
        ];
        expectedResult = service.addSlotListClockToCollectionIfMissing(slotListClockCollection, slotListClock);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a SlotListClock to an array that doesn't contain it", () => {
        const slotListClock: ISlotListClock = { id: 123 };
        const slotListClockCollection: ISlotListClock[] = [{ id: 456 }];
        expectedResult = service.addSlotListClockToCollectionIfMissing(slotListClockCollection, slotListClock);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(slotListClock);
      });

      it('should add only unique SlotListClock to an array', () => {
        const slotListClockArray: ISlotListClock[] = [{ id: 123 }, { id: 456 }, { id: 70419 }];
        const slotListClockCollection: ISlotListClock[] = [{ id: 123 }];
        expectedResult = service.addSlotListClockToCollectionIfMissing(slotListClockCollection, ...slotListClockArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const slotListClock: ISlotListClock = { id: 123 };
        const slotListClock2: ISlotListClock = { id: 456 };
        expectedResult = service.addSlotListClockToCollectionIfMissing([], slotListClock, slotListClock2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(slotListClock);
        expect(expectedResult).toContain(slotListClock2);
      });

      it('should accept null and undefined values', () => {
        const slotListClock: ISlotListClock = { id: 123 };
        expectedResult = service.addSlotListClockToCollectionIfMissing([], null, slotListClock, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(slotListClock);
      });

      it('should return initial array if no SlotListClock is added', () => {
        const slotListClockCollection: ISlotListClock[] = [{ id: 123 }];
        expectedResult = service.addSlotListClockToCollectionIfMissing(slotListClockCollection, undefined, null);
        expect(expectedResult).toEqual(slotListClockCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
