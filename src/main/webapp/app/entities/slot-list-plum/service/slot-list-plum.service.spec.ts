import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ISlotListPlum, SlotListPlum } from '../slot-list-plum.model';

import { SlotListPlumService } from './slot-list-plum.service';

describe('SlotListPlum Service', () => {
  let service: SlotListPlumService;
  let httpMock: HttpTestingController;
  let elemDefault: ISlotListPlum;
  let expectedResult: ISlotListPlum | ISlotListPlum[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SlotListPlumService);
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

    it('should create a SlotListPlum', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new SlotListPlum()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a SlotListPlum', () => {
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

    it('should partial update a SlotListPlum', () => {
      const patchObject = Object.assign(
        {
          coupons: 'BBBBBB',
        },
        new SlotListPlum()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of SlotListPlum', () => {
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

    it('should delete a SlotListPlum', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addSlotListPlumToCollectionIfMissing', () => {
      it('should add a SlotListPlum to an empty array', () => {
        const slotListPlum: ISlotListPlum = { id: 123 };
        expectedResult = service.addSlotListPlumToCollectionIfMissing([], slotListPlum);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(slotListPlum);
      });

      it('should not add a SlotListPlum to an array that contains it', () => {
        const slotListPlum: ISlotListPlum = { id: 123 };
        const slotListPlumCollection: ISlotListPlum[] = [
          {
            ...slotListPlum,
          },
          { id: 456 },
        ];
        expectedResult = service.addSlotListPlumToCollectionIfMissing(slotListPlumCollection, slotListPlum);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a SlotListPlum to an array that doesn't contain it", () => {
        const slotListPlum: ISlotListPlum = { id: 123 };
        const slotListPlumCollection: ISlotListPlum[] = [{ id: 456 }];
        expectedResult = service.addSlotListPlumToCollectionIfMissing(slotListPlumCollection, slotListPlum);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(slotListPlum);
      });

      it('should add only unique SlotListPlum to an array', () => {
        const slotListPlumArray: ISlotListPlum[] = [{ id: 123 }, { id: 456 }, { id: 85273 }];
        const slotListPlumCollection: ISlotListPlum[] = [{ id: 123 }];
        expectedResult = service.addSlotListPlumToCollectionIfMissing(slotListPlumCollection, ...slotListPlumArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const slotListPlum: ISlotListPlum = { id: 123 };
        const slotListPlum2: ISlotListPlum = { id: 456 };
        expectedResult = service.addSlotListPlumToCollectionIfMissing([], slotListPlum, slotListPlum2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(slotListPlum);
        expect(expectedResult).toContain(slotListPlum2);
      });

      it('should accept null and undefined values', () => {
        const slotListPlum: ISlotListPlum = { id: 123 };
        expectedResult = service.addSlotListPlumToCollectionIfMissing([], null, slotListPlum, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(slotListPlum);
      });

      it('should return initial array if no SlotListPlum is added', () => {
        const slotListPlumCollection: ISlotListPlum[] = [{ id: 123 }];
        expectedResult = service.addSlotListPlumToCollectionIfMissing(slotListPlumCollection, undefined, null);
        expect(expectedResult).toEqual(slotListPlumCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
