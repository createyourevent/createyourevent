import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IServiceMap, ServiceMap } from '../service-map.model';

import { ServiceMapService } from './service-map.service';

describe('ServiceMap Service', () => {
  let service: ServiceMapService;
  let httpMock: HttpTestingController;
  let elemDefault: IServiceMap;
  let expectedResult: IServiceMap | IServiceMap[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ServiceMapService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      title: 'AAAAAAA',
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

    it('should create a ServiceMap', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new ServiceMap()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ServiceMap', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          title: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ServiceMap', () => {
      const patchObject = Object.assign({}, new ServiceMap());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ServiceMap', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          title: 'BBBBBB',
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

    it('should delete a ServiceMap', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addServiceMapToCollectionIfMissing', () => {
      it('should add a ServiceMap to an empty array', () => {
        const serviceMap: IServiceMap = { id: 123 };
        expectedResult = service.addServiceMapToCollectionIfMissing([], serviceMap);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(serviceMap);
      });

      it('should not add a ServiceMap to an array that contains it', () => {
        const serviceMap: IServiceMap = { id: 123 };
        const serviceMapCollection: IServiceMap[] = [
          {
            ...serviceMap,
          },
          { id: 456 },
        ];
        expectedResult = service.addServiceMapToCollectionIfMissing(serviceMapCollection, serviceMap);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ServiceMap to an array that doesn't contain it", () => {
        const serviceMap: IServiceMap = { id: 123 };
        const serviceMapCollection: IServiceMap[] = [{ id: 456 }];
        expectedResult = service.addServiceMapToCollectionIfMissing(serviceMapCollection, serviceMap);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(serviceMap);
      });

      it('should add only unique ServiceMap to an array', () => {
        const serviceMapArray: IServiceMap[] = [{ id: 123 }, { id: 456 }, { id: 98591 }];
        const serviceMapCollection: IServiceMap[] = [{ id: 123 }];
        expectedResult = service.addServiceMapToCollectionIfMissing(serviceMapCollection, ...serviceMapArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const serviceMap: IServiceMap = { id: 123 };
        const serviceMap2: IServiceMap = { id: 456 };
        expectedResult = service.addServiceMapToCollectionIfMissing([], serviceMap, serviceMap2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(serviceMap);
        expect(expectedResult).toContain(serviceMap2);
      });

      it('should accept null and undefined values', () => {
        const serviceMap: IServiceMap = { id: 123 };
        expectedResult = service.addServiceMapToCollectionIfMissing([], null, serviceMap, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(serviceMap);
      });

      it('should return initial array if no ServiceMap is added', () => {
        const serviceMapCollection: IServiceMap[] = [{ id: 123 }];
        expectedResult = service.addServiceMapToCollectionIfMissing(serviceMapCollection, undefined, null);
        expect(expectedResult).toEqual(serviceMapCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
