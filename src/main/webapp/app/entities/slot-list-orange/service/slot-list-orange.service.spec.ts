import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ISlotListOrange, SlotListOrange } from '../slot-list-orange.model';

import { SlotListOrangeService } from './slot-list-orange.service';

describe('SlotListOrange Service', () => {
  let service: SlotListOrangeService;
  let httpMock: HttpTestingController;
  let elemDefault: ISlotListOrange;
  let expectedResult: ISlotListOrange | ISlotListOrange[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SlotListOrangeService);
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

    it('should create a SlotListOrange', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new SlotListOrange()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a SlotListOrange', () => {
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

    it('should partial update a SlotListOrange', () => {
      const patchObject = Object.assign({}, new SlotListOrange());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of SlotListOrange', () => {
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

    it('should delete a SlotListOrange', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addSlotListOrangeToCollectionIfMissing', () => {
      it('should add a SlotListOrange to an empty array', () => {
        const slotListOrange: ISlotListOrange = { id: 123 };
        expectedResult = service.addSlotListOrangeToCollectionIfMissing([], slotListOrange);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(slotListOrange);
      });

      it('should not add a SlotListOrange to an array that contains it', () => {
        const slotListOrange: ISlotListOrange = { id: 123 };
        const slotListOrangeCollection: ISlotListOrange[] = [
          {
            ...slotListOrange,
          },
          { id: 456 },
        ];
        expectedResult = service.addSlotListOrangeToCollectionIfMissing(slotListOrangeCollection, slotListOrange);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a SlotListOrange to an array that doesn't contain it", () => {
        const slotListOrange: ISlotListOrange = { id: 123 };
        const slotListOrangeCollection: ISlotListOrange[] = [{ id: 456 }];
        expectedResult = service.addSlotListOrangeToCollectionIfMissing(slotListOrangeCollection, slotListOrange);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(slotListOrange);
      });

      it('should add only unique SlotListOrange to an array', () => {
        const slotListOrangeArray: ISlotListOrange[] = [{ id: 123 }, { id: 456 }, { id: 71394 }];
        const slotListOrangeCollection: ISlotListOrange[] = [{ id: 123 }];
        expectedResult = service.addSlotListOrangeToCollectionIfMissing(slotListOrangeCollection, ...slotListOrangeArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const slotListOrange: ISlotListOrange = { id: 123 };
        const slotListOrange2: ISlotListOrange = { id: 456 };
        expectedResult = service.addSlotListOrangeToCollectionIfMissing([], slotListOrange, slotListOrange2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(slotListOrange);
        expect(expectedResult).toContain(slotListOrange2);
      });

      it('should accept null and undefined values', () => {
        const slotListOrange: ISlotListOrange = { id: 123 };
        expectedResult = service.addSlotListOrangeToCollectionIfMissing([], null, slotListOrange, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(slotListOrange);
      });

      it('should return initial array if no SlotListOrange is added', () => {
        const slotListOrangeCollection: ISlotListOrange[] = [{ id: 123 }];
        expectedResult = service.addSlotListOrangeToCollectionIfMissing(slotListOrangeCollection, undefined, null);
        expect(expectedResult).toEqual(slotListOrangeCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
