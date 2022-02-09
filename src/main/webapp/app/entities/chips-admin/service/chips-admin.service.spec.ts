import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IChipsAdmin, ChipsAdmin } from '../chips-admin.model';

import { ChipsAdminService } from './chips-admin.service';

describe('ChipsAdmin Service', () => {
  let service: ChipsAdminService;
  let httpMock: HttpTestingController;
  let elemDefault: IChipsAdmin;
  let expectedResult: IChipsAdmin | IChipsAdmin[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ChipsAdminService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      gameActive: false,
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

    it('should create a ChipsAdmin', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new ChipsAdmin()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ChipsAdmin', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          gameActive: true,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ChipsAdmin', () => {
      const patchObject = Object.assign(
        {
          gameActive: true,
        },
        new ChipsAdmin()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ChipsAdmin', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          gameActive: true,
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

    it('should delete a ChipsAdmin', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addChipsAdminToCollectionIfMissing', () => {
      it('should add a ChipsAdmin to an empty array', () => {
        const chipsAdmin: IChipsAdmin = { id: 123 };
        expectedResult = service.addChipsAdminToCollectionIfMissing([], chipsAdmin);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(chipsAdmin);
      });

      it('should not add a ChipsAdmin to an array that contains it', () => {
        const chipsAdmin: IChipsAdmin = { id: 123 };
        const chipsAdminCollection: IChipsAdmin[] = [
          {
            ...chipsAdmin,
          },
          { id: 456 },
        ];
        expectedResult = service.addChipsAdminToCollectionIfMissing(chipsAdminCollection, chipsAdmin);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ChipsAdmin to an array that doesn't contain it", () => {
        const chipsAdmin: IChipsAdmin = { id: 123 };
        const chipsAdminCollection: IChipsAdmin[] = [{ id: 456 }];
        expectedResult = service.addChipsAdminToCollectionIfMissing(chipsAdminCollection, chipsAdmin);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(chipsAdmin);
      });

      it('should add only unique ChipsAdmin to an array', () => {
        const chipsAdminArray: IChipsAdmin[] = [{ id: 123 }, { id: 456 }, { id: 83323 }];
        const chipsAdminCollection: IChipsAdmin[] = [{ id: 123 }];
        expectedResult = service.addChipsAdminToCollectionIfMissing(chipsAdminCollection, ...chipsAdminArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const chipsAdmin: IChipsAdmin = { id: 123 };
        const chipsAdmin2: IChipsAdmin = { id: 456 };
        expectedResult = service.addChipsAdminToCollectionIfMissing([], chipsAdmin, chipsAdmin2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(chipsAdmin);
        expect(expectedResult).toContain(chipsAdmin2);
      });

      it('should accept null and undefined values', () => {
        const chipsAdmin: IChipsAdmin = { id: 123 };
        expectedResult = service.addChipsAdminToCollectionIfMissing([], null, chipsAdmin, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(chipsAdmin);
      });

      it('should return initial array if no ChipsAdmin is added', () => {
        const chipsAdminCollection: IChipsAdmin[] = [{ id: 123 }];
        expectedResult = service.addChipsAdminToCollectionIfMissing(chipsAdminCollection, undefined, null);
        expect(expectedResult).toEqual(chipsAdminCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
