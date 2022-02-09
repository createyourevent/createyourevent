import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ServiceCategory } from 'app/entities/enumerations/service-category.model';
import { ICreateYourEventService, CreateYourEventService } from '../create-your-event-service.model';

import { CreateYourEventServiceService } from './create-your-event-service.service';

describe('CreateYourEventService Service', () => {
  let service: CreateYourEventServiceService;
  let httpMock: HttpTestingController;
  let elemDefault: ICreateYourEventService;
  let expectedResult: ICreateYourEventService | ICreateYourEventService[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CreateYourEventServiceService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      name: 'AAAAAAA',
      logoContentType: 'image/png',
      logo: 'AAAAAAA',
      active: false,
      activeOwner: false,
      description: 'AAAAAAA',
      address: 'AAAAAAA',
      motto: 'AAAAAAA',
      phone: 'AAAAAAA',
      webAddress: 'AAAAAAA',
      category: ServiceCategory.SECURITAS,
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

    it('should create a CreateYourEventService', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new CreateYourEventService()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a CreateYourEventService', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          logo: 'BBBBBB',
          active: true,
          activeOwner: true,
          description: 'BBBBBB',
          address: 'BBBBBB',
          motto: 'BBBBBB',
          phone: 'BBBBBB',
          webAddress: 'BBBBBB',
          category: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a CreateYourEventService', () => {
      const patchObject = Object.assign(
        {
          activeOwner: true,
          motto: 'BBBBBB',
          webAddress: 'BBBBBB',
        },
        new CreateYourEventService()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of CreateYourEventService', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          logo: 'BBBBBB',
          active: true,
          activeOwner: true,
          description: 'BBBBBB',
          address: 'BBBBBB',
          motto: 'BBBBBB',
          phone: 'BBBBBB',
          webAddress: 'BBBBBB',
          category: 'BBBBBB',
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

    it('should delete a CreateYourEventService', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addCreateYourEventServiceToCollectionIfMissing', () => {
      it('should add a CreateYourEventService to an empty array', () => {
        const createYourEventService: ICreateYourEventService = { id: 123 };
        expectedResult = service.addCreateYourEventServiceToCollectionIfMissing([], createYourEventService);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(createYourEventService);
      });

      it('should not add a CreateYourEventService to an array that contains it', () => {
        const createYourEventService: ICreateYourEventService = { id: 123 };
        const createYourEventServiceCollection: ICreateYourEventService[] = [
          {
            ...createYourEventService,
          },
          { id: 456 },
        ];
        expectedResult = service.addCreateYourEventServiceToCollectionIfMissing(createYourEventServiceCollection, createYourEventService);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a CreateYourEventService to an array that doesn't contain it", () => {
        const createYourEventService: ICreateYourEventService = { id: 123 };
        const createYourEventServiceCollection: ICreateYourEventService[] = [{ id: 456 }];
        expectedResult = service.addCreateYourEventServiceToCollectionIfMissing(createYourEventServiceCollection, createYourEventService);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(createYourEventService);
      });

      it('should add only unique CreateYourEventService to an array', () => {
        const createYourEventServiceArray: ICreateYourEventService[] = [{ id: 123 }, { id: 456 }, { id: 83221 }];
        const createYourEventServiceCollection: ICreateYourEventService[] = [{ id: 123 }];
        expectedResult = service.addCreateYourEventServiceToCollectionIfMissing(
          createYourEventServiceCollection,
          ...createYourEventServiceArray
        );
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const createYourEventService: ICreateYourEventService = { id: 123 };
        const createYourEventService2: ICreateYourEventService = { id: 456 };
        expectedResult = service.addCreateYourEventServiceToCollectionIfMissing([], createYourEventService, createYourEventService2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(createYourEventService);
        expect(expectedResult).toContain(createYourEventService2);
      });

      it('should accept null and undefined values', () => {
        const createYourEventService: ICreateYourEventService = { id: 123 };
        expectedResult = service.addCreateYourEventServiceToCollectionIfMissing([], null, createYourEventService, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(createYourEventService);
      });

      it('should return initial array if no CreateYourEventService is added', () => {
        const createYourEventServiceCollection: ICreateYourEventService[] = [{ id: 123 }];
        expectedResult = service.addCreateYourEventServiceToCollectionIfMissing(createYourEventServiceCollection, undefined, null);
        expect(expectedResult).toEqual(createYourEventServiceCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
