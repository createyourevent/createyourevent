import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IChipsCollection, ChipsCollection } from '../chips-collection.model';

import { ChipsCollectionService } from './chips-collection.service';

describe('ChipsCollection Service', () => {
  let service: ChipsCollectionService;
  let httpMock: HttpTestingController;
  let elemDefault: IChipsCollection;
  let expectedResult: IChipsCollection | IChipsCollection[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ChipsCollectionService);
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

    it('should create a ChipsCollection', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new ChipsCollection()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ChipsCollection', () => {
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

    it('should partial update a ChipsCollection', () => {
      const patchObject = Object.assign({}, new ChipsCollection());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ChipsCollection', () => {
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

    it('should delete a ChipsCollection', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addChipsCollectionToCollectionIfMissing', () => {
      it('should add a ChipsCollection to an empty array', () => {
        const chipsCollection: IChipsCollection = { id: 123 };
        expectedResult = service.addChipsCollectionToCollectionIfMissing([], chipsCollection);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(chipsCollection);
      });

      it('should not add a ChipsCollection to an array that contains it', () => {
        const chipsCollection: IChipsCollection = { id: 123 };
        const chipsCollectionCollection: IChipsCollection[] = [
          {
            ...chipsCollection,
          },
          { id: 456 },
        ];
        expectedResult = service.addChipsCollectionToCollectionIfMissing(chipsCollectionCollection, chipsCollection);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ChipsCollection to an array that doesn't contain it", () => {
        const chipsCollection: IChipsCollection = { id: 123 };
        const chipsCollectionCollection: IChipsCollection[] = [{ id: 456 }];
        expectedResult = service.addChipsCollectionToCollectionIfMissing(chipsCollectionCollection, chipsCollection);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(chipsCollection);
      });

      it('should add only unique ChipsCollection to an array', () => {
        const chipsCollectionArray: IChipsCollection[] = [{ id: 123 }, { id: 456 }, { id: 93755 }];
        const chipsCollectionCollection: IChipsCollection[] = [{ id: 123 }];
        expectedResult = service.addChipsCollectionToCollectionIfMissing(chipsCollectionCollection, ...chipsCollectionArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const chipsCollection: IChipsCollection = { id: 123 };
        const chipsCollection2: IChipsCollection = { id: 456 };
        expectedResult = service.addChipsCollectionToCollectionIfMissing([], chipsCollection, chipsCollection2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(chipsCollection);
        expect(expectedResult).toContain(chipsCollection2);
      });

      it('should accept null and undefined values', () => {
        const chipsCollection: IChipsCollection = { id: 123 };
        expectedResult = service.addChipsCollectionToCollectionIfMissing([], null, chipsCollection, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(chipsCollection);
      });

      it('should return initial array if no ChipsCollection is added', () => {
        const chipsCollectionCollection: IChipsCollection[] = [{ id: 123 }];
        expectedResult = service.addChipsCollectionToCollectionIfMissing(chipsCollectionCollection, undefined, null);
        expect(expectedResult).toEqual(chipsCollectionCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
