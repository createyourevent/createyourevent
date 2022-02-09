import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IChips, Chips } from '../chips.model';

import { ChipsService } from './chips.service';

describe('Chips Service', () => {
  let service: ChipsService;
  let httpMock: HttpTestingController;
  let elemDefault: IChips;
  let expectedResult: IChips | IChips[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ChipsService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      points: 0,
      website: 'AAAAAAA',
      x: 0,
      y: 0,
      imageContentType: 'image/png',
      image: 'AAAAAAA',
      color: 'AAAAAAA',
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

    it('should create a Chips', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Chips()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Chips', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          points: 1,
          website: 'BBBBBB',
          x: 1,
          y: 1,
          image: 'BBBBBB',
          color: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Chips', () => {
      const patchObject = Object.assign(
        {
          points: 1,
          image: 'BBBBBB',
          color: 'BBBBBB',
        },
        new Chips()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Chips', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          points: 1,
          website: 'BBBBBB',
          x: 1,
          y: 1,
          image: 'BBBBBB',
          color: 'BBBBBB',
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

    it('should delete a Chips', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addChipsToCollectionIfMissing', () => {
      it('should add a Chips to an empty array', () => {
        const chips: IChips = { id: 123 };
        expectedResult = service.addChipsToCollectionIfMissing([], chips);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(chips);
      });

      it('should not add a Chips to an array that contains it', () => {
        const chips: IChips = { id: 123 };
        const chipsCollection: IChips[] = [
          {
            ...chips,
          },
          { id: 456 },
        ];
        expectedResult = service.addChipsToCollectionIfMissing(chipsCollection, chips);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Chips to an array that doesn't contain it", () => {
        const chips: IChips = { id: 123 };
        const chipsCollection: IChips[] = [{ id: 456 }];
        expectedResult = service.addChipsToCollectionIfMissing(chipsCollection, chips);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(chips);
      });

      it('should add only unique Chips to an array', () => {
        const chipsArray: IChips[] = [{ id: 123 }, { id: 456 }, { id: 97222 }];
        const chipsCollection: IChips[] = [{ id: 123 }];
        expectedResult = service.addChipsToCollectionIfMissing(chipsCollection, ...chipsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const chips: IChips = { id: 123 };
        const chips2: IChips = { id: 456 };
        expectedResult = service.addChipsToCollectionIfMissing([], chips, chips2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(chips);
        expect(expectedResult).toContain(chips2);
      });

      it('should accept null and undefined values', () => {
        const chips: IChips = { id: 123 };
        expectedResult = service.addChipsToCollectionIfMissing([], null, chips, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(chips);
      });

      it('should return initial array if no Chips is added', () => {
        const chipsCollection: IChips[] = [{ id: 123 }];
        expectedResult = service.addChipsToCollectionIfMissing(chipsCollection, undefined, null);
        expect(expectedResult).toEqual(chipsCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
