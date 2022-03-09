import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ISlotListCherry, SlotListCherry } from '../slot-list-cherry.model';

import { SlotListCherryService } from './slot-list-cherry.service';

describe('SlotListCherry Service', () => {
  let service: SlotListCherryService;
  let httpMock: HttpTestingController;
  let elemDefault: ISlotListCherry;
  let expectedResult: ISlotListCherry | ISlotListCherry[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SlotListCherryService);
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

    it('should create a SlotListCherry', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new SlotListCherry()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a SlotListCherry', () => {
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

    it('should partial update a SlotListCherry', () => {
      const patchObject = Object.assign(
        {
          coupons: 'BBBBBB',
        },
        new SlotListCherry()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of SlotListCherry', () => {
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

    it('should delete a SlotListCherry', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addSlotListCherryToCollectionIfMissing', () => {
      it('should add a SlotListCherry to an empty array', () => {
        const slotListCherry: ISlotListCherry = { id: 123 };
        expectedResult = service.addSlotListCherryToCollectionIfMissing([], slotListCherry);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(slotListCherry);
      });

      it('should not add a SlotListCherry to an array that contains it', () => {
        const slotListCherry: ISlotListCherry = { id: 123 };
        const slotListCherryCollection: ISlotListCherry[] = [
          {
            ...slotListCherry,
          },
          { id: 456 },
        ];
        expectedResult = service.addSlotListCherryToCollectionIfMissing(slotListCherryCollection, slotListCherry);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a SlotListCherry to an array that doesn't contain it", () => {
        const slotListCherry: ISlotListCherry = { id: 123 };
        const slotListCherryCollection: ISlotListCherry[] = [{ id: 456 }];
        expectedResult = service.addSlotListCherryToCollectionIfMissing(slotListCherryCollection, slotListCherry);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(slotListCherry);
      });

      it('should add only unique SlotListCherry to an array', () => {
        const slotListCherryArray: ISlotListCherry[] = [{ id: 123 }, { id: 456 }, { id: 75123 }];
        const slotListCherryCollection: ISlotListCherry[] = [{ id: 123 }];
        expectedResult = service.addSlotListCherryToCollectionIfMissing(slotListCherryCollection, ...slotListCherryArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const slotListCherry: ISlotListCherry = { id: 123 };
        const slotListCherry2: ISlotListCherry = { id: 456 };
        expectedResult = service.addSlotListCherryToCollectionIfMissing([], slotListCherry, slotListCherry2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(slotListCherry);
        expect(expectedResult).toContain(slotListCherry2);
      });

      it('should accept null and undefined values', () => {
        const slotListCherry: ISlotListCherry = { id: 123 };
        expectedResult = service.addSlotListCherryToCollectionIfMissing([], null, slotListCherry, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(slotListCherry);
      });

      it('should return initial array if no SlotListCherry is added', () => {
        const slotListCherryCollection: ISlotListCherry[] = [{ id: 123 }];
        expectedResult = service.addSlotListCherryToCollectionIfMissing(slotListCherryCollection, undefined, null);
        expect(expectedResult).toEqual(slotListCherryCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
