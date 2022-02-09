import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IUserExtension, UserExtension } from '../user-extension.model';

import { UserExtensionService } from './user-extension.service';

describe('UserExtension Service', () => {
  let service: UserExtensionService;
  let httpMock: HttpTestingController;
  let elemDefault: IUserExtension;
  let expectedResult: IUserExtension | IUserExtension[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(UserExtensionService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      address: 'AAAAAAA',
      phone: 'AAAAAAA',
      loggedIn: false,
      points: 0,
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

    it('should create a UserExtension', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new UserExtension()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a UserExtension', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          address: 'BBBBBB',
          phone: 'BBBBBB',
          loggedIn: true,
          points: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a UserExtension', () => {
      const patchObject = Object.assign(
        {
          phone: 'BBBBBB',
        },
        new UserExtension()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of UserExtension', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          address: 'BBBBBB',
          phone: 'BBBBBB',
          loggedIn: true,
          points: 1,
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

    it('should delete a UserExtension', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addUserExtensionToCollectionIfMissing', () => {
      it('should add a UserExtension to an empty array', () => {
        const userExtension: IUserExtension = { id: 123 };
        expectedResult = service.addUserExtensionToCollectionIfMissing([], userExtension);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(userExtension);
      });

      it('should not add a UserExtension to an array that contains it', () => {
        const userExtension: IUserExtension = { id: 123 };
        const userExtensionCollection: IUserExtension[] = [
          {
            ...userExtension,
          },
          { id: 456 },
        ];
        expectedResult = service.addUserExtensionToCollectionIfMissing(userExtensionCollection, userExtension);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a UserExtension to an array that doesn't contain it", () => {
        const userExtension: IUserExtension = { id: 123 };
        const userExtensionCollection: IUserExtension[] = [{ id: 456 }];
        expectedResult = service.addUserExtensionToCollectionIfMissing(userExtensionCollection, userExtension);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(userExtension);
      });

      it('should add only unique UserExtension to an array', () => {
        const userExtensionArray: IUserExtension[] = [{ id: 123 }, { id: 456 }, { id: 10191 }];
        const userExtensionCollection: IUserExtension[] = [{ id: 123 }];
        expectedResult = service.addUserExtensionToCollectionIfMissing(userExtensionCollection, ...userExtensionArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const userExtension: IUserExtension = { id: 123 };
        const userExtension2: IUserExtension = { id: 456 };
        expectedResult = service.addUserExtensionToCollectionIfMissing([], userExtension, userExtension2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(userExtension);
        expect(expectedResult).toContain(userExtension2);
      });

      it('should accept null and undefined values', () => {
        const userExtension: IUserExtension = { id: 123 };
        expectedResult = service.addUserExtensionToCollectionIfMissing([], null, userExtension, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(userExtension);
      });

      it('should return initial array if no UserExtension is added', () => {
        const userExtensionCollection: IUserExtension[] = [{ id: 123 }];
        expectedResult = service.addUserExtensionToCollectionIfMissing(userExtensionCollection, undefined, null);
        expect(expectedResult).toEqual(userExtensionCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
