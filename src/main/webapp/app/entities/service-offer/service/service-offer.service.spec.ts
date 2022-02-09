import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IServiceOffer, ServiceOffer } from '../service-offer.model';

import { ServiceOfferService } from './service-offer.service';

describe('ServiceOffer Service', () => {
  let service: ServiceOfferService;
  let httpMock: HttpTestingController;
  let elemDefault: IServiceOffer;
  let expectedResult: IServiceOffer | IServiceOffer[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ServiceOfferService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      title: 'AAAAAAA',
      description: 'AAAAAAA',
      costHour: 0,
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

    it('should create a ServiceOffer', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new ServiceOffer()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ServiceOffer', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          title: 'BBBBBB',
          description: 'BBBBBB',
          costHour: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ServiceOffer', () => {
      const patchObject = Object.assign(
        {
          title: 'BBBBBB',
          description: 'BBBBBB',
        },
        new ServiceOffer()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ServiceOffer', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          title: 'BBBBBB',
          description: 'BBBBBB',
          costHour: 1,
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

    it('should delete a ServiceOffer', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addServiceOfferToCollectionIfMissing', () => {
      it('should add a ServiceOffer to an empty array', () => {
        const serviceOffer: IServiceOffer = { id: 123 };
        expectedResult = service.addServiceOfferToCollectionIfMissing([], serviceOffer);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(serviceOffer);
      });

      it('should not add a ServiceOffer to an array that contains it', () => {
        const serviceOffer: IServiceOffer = { id: 123 };
        const serviceOfferCollection: IServiceOffer[] = [
          {
            ...serviceOffer,
          },
          { id: 456 },
        ];
        expectedResult = service.addServiceOfferToCollectionIfMissing(serviceOfferCollection, serviceOffer);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ServiceOffer to an array that doesn't contain it", () => {
        const serviceOffer: IServiceOffer = { id: 123 };
        const serviceOfferCollection: IServiceOffer[] = [{ id: 456 }];
        expectedResult = service.addServiceOfferToCollectionIfMissing(serviceOfferCollection, serviceOffer);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(serviceOffer);
      });

      it('should add only unique ServiceOffer to an array', () => {
        const serviceOfferArray: IServiceOffer[] = [{ id: 123 }, { id: 456 }, { id: 33264 }];
        const serviceOfferCollection: IServiceOffer[] = [{ id: 123 }];
        expectedResult = service.addServiceOfferToCollectionIfMissing(serviceOfferCollection, ...serviceOfferArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const serviceOffer: IServiceOffer = { id: 123 };
        const serviceOffer2: IServiceOffer = { id: 456 };
        expectedResult = service.addServiceOfferToCollectionIfMissing([], serviceOffer, serviceOffer2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(serviceOffer);
        expect(expectedResult).toContain(serviceOffer2);
      });

      it('should accept null and undefined values', () => {
        const serviceOffer: IServiceOffer = { id: 123 };
        expectedResult = service.addServiceOfferToCollectionIfMissing([], null, serviceOffer, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(serviceOffer);
      });

      it('should return initial array if no ServiceOffer is added', () => {
        const serviceOfferCollection: IServiceOffer[] = [{ id: 123 }];
        expectedResult = service.addServiceOfferToCollectionIfMissing(serviceOfferCollection, undefined, null);
        expect(expectedResult).toEqual(serviceOfferCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
