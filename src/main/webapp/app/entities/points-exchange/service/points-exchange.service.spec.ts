import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IPointsExchange, PointsExchange } from '../points-exchange.model';

import { PointsExchangeService } from './points-exchange.service';

describe('PointsExchange Service', () => {
  let service: PointsExchangeService;
  let httpMock: HttpTestingController;
  let elemDefault: IPointsExchange;
  let expectedResult: IPointsExchange | IPointsExchange[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PointsExchangeService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      pointsTotal: 0,
      bondPointsTotal: 0,
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

    it('should create a PointsExchange', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new PointsExchange()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a PointsExchange', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          pointsTotal: 1,
          bondPointsTotal: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a PointsExchange', () => {
      const patchObject = Object.assign({}, new PointsExchange());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of PointsExchange', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          pointsTotal: 1,
          bondPointsTotal: 1,
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

    it('should delete a PointsExchange', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addPointsExchangeToCollectionIfMissing', () => {
      it('should add a PointsExchange to an empty array', () => {
        const pointsExchange: IPointsExchange = { id: 123 };
        expectedResult = service.addPointsExchangeToCollectionIfMissing([], pointsExchange);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(pointsExchange);
      });

      it('should not add a PointsExchange to an array that contains it', () => {
        const pointsExchange: IPointsExchange = { id: 123 };
        const pointsExchangeCollection: IPointsExchange[] = [
          {
            ...pointsExchange,
          },
          { id: 456 },
        ];
        expectedResult = service.addPointsExchangeToCollectionIfMissing(pointsExchangeCollection, pointsExchange);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a PointsExchange to an array that doesn't contain it", () => {
        const pointsExchange: IPointsExchange = { id: 123 };
        const pointsExchangeCollection: IPointsExchange[] = [{ id: 456 }];
        expectedResult = service.addPointsExchangeToCollectionIfMissing(pointsExchangeCollection, pointsExchange);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(pointsExchange);
      });

      it('should add only unique PointsExchange to an array', () => {
        const pointsExchangeArray: IPointsExchange[] = [{ id: 123 }, { id: 456 }, { id: 24188 }];
        const pointsExchangeCollection: IPointsExchange[] = [{ id: 123 }];
        expectedResult = service.addPointsExchangeToCollectionIfMissing(pointsExchangeCollection, ...pointsExchangeArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const pointsExchange: IPointsExchange = { id: 123 };
        const pointsExchange2: IPointsExchange = { id: 456 };
        expectedResult = service.addPointsExchangeToCollectionIfMissing([], pointsExchange, pointsExchange2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(pointsExchange);
        expect(expectedResult).toContain(pointsExchange2);
      });

      it('should accept null and undefined values', () => {
        const pointsExchange: IPointsExchange = { id: 123 };
        expectedResult = service.addPointsExchangeToCollectionIfMissing([], null, pointsExchange, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(pointsExchange);
      });

      it('should return initial array if no PointsExchange is added', () => {
        const pointsExchangeCollection: IPointsExchange[] = [{ id: 123 }];
        expectedResult = service.addPointsExchangeToCollectionIfMissing(pointsExchangeCollection, undefined, null);
        expect(expectedResult).toEqual(pointsExchangeCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
