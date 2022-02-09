import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAdminFeesPrice, AdminFeesPrice } from '../admin-fees-price.model';

import { AdminFeesPriceService } from './admin-fees-price.service';

describe('AdminFeesPrice Service', () => {
  let service: AdminFeesPriceService;
  let httpMock: HttpTestingController;
  let elemDefault: IAdminFeesPrice;
  let expectedResult: IAdminFeesPrice | IAdminFeesPrice[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(AdminFeesPriceService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      feesOrganisator: 0,
      feesSupplier: 0,
      feesService: 0,
      feesOrganizations: 0,
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

    it('should create a AdminFeesPrice', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new AdminFeesPrice()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a AdminFeesPrice', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          feesOrganisator: 1,
          feesSupplier: 1,
          feesService: 1,
          feesOrganizations: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a AdminFeesPrice', () => {
      const patchObject = Object.assign(
        {
          feesOrganisator: 1,
          feesService: 1,
        },
        new AdminFeesPrice()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of AdminFeesPrice', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          feesOrganisator: 1,
          feesSupplier: 1,
          feesService: 1,
          feesOrganizations: 1,
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

    it('should delete a AdminFeesPrice', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addAdminFeesPriceToCollectionIfMissing', () => {
      it('should add a AdminFeesPrice to an empty array', () => {
        const adminFeesPrice: IAdminFeesPrice = { id: 123 };
        expectedResult = service.addAdminFeesPriceToCollectionIfMissing([], adminFeesPrice);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(adminFeesPrice);
      });

      it('should not add a AdminFeesPrice to an array that contains it', () => {
        const adminFeesPrice: IAdminFeesPrice = { id: 123 };
        const adminFeesPriceCollection: IAdminFeesPrice[] = [
          {
            ...adminFeesPrice,
          },
          { id: 456 },
        ];
        expectedResult = service.addAdminFeesPriceToCollectionIfMissing(adminFeesPriceCollection, adminFeesPrice);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a AdminFeesPrice to an array that doesn't contain it", () => {
        const adminFeesPrice: IAdminFeesPrice = { id: 123 };
        const adminFeesPriceCollection: IAdminFeesPrice[] = [{ id: 456 }];
        expectedResult = service.addAdminFeesPriceToCollectionIfMissing(adminFeesPriceCollection, adminFeesPrice);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(adminFeesPrice);
      });

      it('should add only unique AdminFeesPrice to an array', () => {
        const adminFeesPriceArray: IAdminFeesPrice[] = [{ id: 123 }, { id: 456 }, { id: 14871 }];
        const adminFeesPriceCollection: IAdminFeesPrice[] = [{ id: 123 }];
        expectedResult = service.addAdminFeesPriceToCollectionIfMissing(adminFeesPriceCollection, ...adminFeesPriceArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const adminFeesPrice: IAdminFeesPrice = { id: 123 };
        const adminFeesPrice2: IAdminFeesPrice = { id: 456 };
        expectedResult = service.addAdminFeesPriceToCollectionIfMissing([], adminFeesPrice, adminFeesPrice2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(adminFeesPrice);
        expect(expectedResult).toContain(adminFeesPrice2);
      });

      it('should accept null and undefined values', () => {
        const adminFeesPrice: IAdminFeesPrice = { id: 123 };
        expectedResult = service.addAdminFeesPriceToCollectionIfMissing([], null, adminFeesPrice, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(adminFeesPrice);
      });

      it('should return initial array if no AdminFeesPrice is added', () => {
        const adminFeesPriceCollection: IAdminFeesPrice[] = [{ id: 123 }];
        expectedResult = service.addAdminFeesPriceToCollectionIfMissing(adminFeesPriceCollection, undefined, null);
        expect(expectedResult).toEqual(adminFeesPriceCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
