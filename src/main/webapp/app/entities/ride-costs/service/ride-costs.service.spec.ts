import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IRideCosts, RideCosts } from '../ride-costs.model';

import { RideCostsService } from './ride-costs.service';

describe('RideCosts Service', () => {
  let service: RideCostsService;
  let httpMock: HttpTestingController;
  let elemDefault: IRideCosts;
  let expectedResult: IRideCosts | IRideCosts[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(RideCostsService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      pricePerKilometre: 0,
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

    it('should create a RideCosts', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new RideCosts()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a RideCosts', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          pricePerKilometre: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a RideCosts', () => {
      const patchObject = Object.assign({}, new RideCosts());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of RideCosts', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          pricePerKilometre: 1,
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

    it('should delete a RideCosts', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addRideCostsToCollectionIfMissing', () => {
      it('should add a RideCosts to an empty array', () => {
        const rideCosts: IRideCosts = { id: 123 };
        expectedResult = service.addRideCostsToCollectionIfMissing([], rideCosts);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(rideCosts);
      });

      it('should not add a RideCosts to an array that contains it', () => {
        const rideCosts: IRideCosts = { id: 123 };
        const rideCostsCollection: IRideCosts[] = [
          {
            ...rideCosts,
          },
          { id: 456 },
        ];
        expectedResult = service.addRideCostsToCollectionIfMissing(rideCostsCollection, rideCosts);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a RideCosts to an array that doesn't contain it", () => {
        const rideCosts: IRideCosts = { id: 123 };
        const rideCostsCollection: IRideCosts[] = [{ id: 456 }];
        expectedResult = service.addRideCostsToCollectionIfMissing(rideCostsCollection, rideCosts);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(rideCosts);
      });

      it('should add only unique RideCosts to an array', () => {
        const rideCostsArray: IRideCosts[] = [{ id: 123 }, { id: 456 }, { id: 77626 }];
        const rideCostsCollection: IRideCosts[] = [{ id: 123 }];
        expectedResult = service.addRideCostsToCollectionIfMissing(rideCostsCollection, ...rideCostsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const rideCosts: IRideCosts = { id: 123 };
        const rideCosts2: IRideCosts = { id: 456 };
        expectedResult = service.addRideCostsToCollectionIfMissing([], rideCosts, rideCosts2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(rideCosts);
        expect(expectedResult).toContain(rideCosts2);
      });

      it('should accept null and undefined values', () => {
        const rideCosts: IRideCosts = { id: 123 };
        expectedResult = service.addRideCostsToCollectionIfMissing([], null, rideCosts, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(rideCosts);
      });

      it('should return initial array if no RideCosts is added', () => {
        const rideCostsCollection: IRideCosts[] = [{ id: 123 }];
        expectedResult = service.addRideCostsToCollectionIfMissing(rideCostsCollection, undefined, null);
        expect(expectedResult).toEqual(rideCostsCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
