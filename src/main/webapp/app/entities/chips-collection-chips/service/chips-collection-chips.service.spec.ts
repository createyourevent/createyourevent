import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IChipsCollectionChips, ChipsCollectionChips } from '../chips-collection-chips.model';

import { ChipsCollectionChipsService } from './chips-collection-chips.service';

describe('ChipsCollectionChips Service', () => {
  let service: ChipsCollectionChipsService;
  let httpMock: HttpTestingController;
  let elemDefault: IChipsCollectionChips;
  let expectedResult: IChipsCollectionChips | IChipsCollectionChips[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ChipsCollectionChipsService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
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

    it('should create a ChipsCollectionChips', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new ChipsCollectionChips()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ChipsCollectionChips', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ChipsCollectionChips', () => {
      const patchObject = Object.assign({}, new ChipsCollectionChips());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ChipsCollectionChips', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
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

    it('should delete a ChipsCollectionChips', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addChipsCollectionChipsToCollectionIfMissing', () => {
      it('should add a ChipsCollectionChips to an empty array', () => {
        const chipsCollectionChips: IChipsCollectionChips = { id: 123 };
        expectedResult = service.addChipsCollectionChipsToCollectionIfMissing([], chipsCollectionChips);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(chipsCollectionChips);
      });

      it('should not add a ChipsCollectionChips to an array that contains it', () => {
        const chipsCollectionChips: IChipsCollectionChips = { id: 123 };
        const chipsCollectionChipsCollection: IChipsCollectionChips[] = [
          {
            ...chipsCollectionChips,
          },
          { id: 456 },
        ];
        expectedResult = service.addChipsCollectionChipsToCollectionIfMissing(chipsCollectionChipsCollection, chipsCollectionChips);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ChipsCollectionChips to an array that doesn't contain it", () => {
        const chipsCollectionChips: IChipsCollectionChips = { id: 123 };
        const chipsCollectionChipsCollection: IChipsCollectionChips[] = [{ id: 456 }];
        expectedResult = service.addChipsCollectionChipsToCollectionIfMissing(chipsCollectionChipsCollection, chipsCollectionChips);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(chipsCollectionChips);
      });

      it('should add only unique ChipsCollectionChips to an array', () => {
        const chipsCollectionChipsArray: IChipsCollectionChips[] = [{ id: 123 }, { id: 456 }, { id: 37035 }];
        const chipsCollectionChipsCollection: IChipsCollectionChips[] = [{ id: 123 }];
        expectedResult = service.addChipsCollectionChipsToCollectionIfMissing(chipsCollectionChipsCollection, ...chipsCollectionChipsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const chipsCollectionChips: IChipsCollectionChips = { id: 123 };
        const chipsCollectionChips2: IChipsCollectionChips = { id: 456 };
        expectedResult = service.addChipsCollectionChipsToCollectionIfMissing([], chipsCollectionChips, chipsCollectionChips2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(chipsCollectionChips);
        expect(expectedResult).toContain(chipsCollectionChips2);
      });

      it('should accept null and undefined values', () => {
        const chipsCollectionChips: IChipsCollectionChips = { id: 123 };
        expectedResult = service.addChipsCollectionChipsToCollectionIfMissing([], null, chipsCollectionChips, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(chipsCollectionChips);
      });

      it('should return initial array if no ChipsCollectionChips is added', () => {
        const chipsCollectionChipsCollection: IChipsCollectionChips[] = [{ id: 123 }];
        expectedResult = service.addChipsCollectionChipsToCollectionIfMissing(chipsCollectionChipsCollection, undefined, null);
        expect(expectedResult).toEqual(chipsCollectionChipsCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
