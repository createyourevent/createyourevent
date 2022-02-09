import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IMp3, Mp3 } from '../mp-3.model';

import { Mp3Service } from './mp-3.service';

describe('Mp3 Service', () => {
  let service: Mp3Service;
  let httpMock: HttpTestingController;
  let elemDefault: IMp3;
  let expectedResult: IMp3 | IMp3[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(Mp3Service);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      title: 'AAAAAAA',
      artists: 'AAAAAAA',
      duration: 0,
      url: 'AAAAAAA',
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

    it('should create a Mp3', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Mp3()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Mp3', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          title: 'BBBBBB',
          artists: 'BBBBBB',
          duration: 1,
          url: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Mp3', () => {
      const patchObject = Object.assign(
        {
          duration: 1,
          url: 'BBBBBB',
        },
        new Mp3()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Mp3', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          title: 'BBBBBB',
          artists: 'BBBBBB',
          duration: 1,
          url: 'BBBBBB',
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

    it('should delete a Mp3', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addMp3ToCollectionIfMissing', () => {
      it('should add a Mp3 to an empty array', () => {
        const mp3: IMp3 = { id: 123 };
        expectedResult = service.addMp3ToCollectionIfMissing([], mp3);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(mp3);
      });

      it('should not add a Mp3 to an array that contains it', () => {
        const mp3: IMp3 = { id: 123 };
        const mp3Collection: IMp3[] = [
          {
            ...mp3,
          },
          { id: 456 },
        ];
        expectedResult = service.addMp3ToCollectionIfMissing(mp3Collection, mp3);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Mp3 to an array that doesn't contain it", () => {
        const mp3: IMp3 = { id: 123 };
        const mp3Collection: IMp3[] = [{ id: 456 }];
        expectedResult = service.addMp3ToCollectionIfMissing(mp3Collection, mp3);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(mp3);
      });

      it('should add only unique Mp3 to an array', () => {
        const mp3Array: IMp3[] = [{ id: 123 }, { id: 456 }, { id: 30466 }];
        const mp3Collection: IMp3[] = [{ id: 123 }];
        expectedResult = service.addMp3ToCollectionIfMissing(mp3Collection, ...mp3Array);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const mp3: IMp3 = { id: 123 };
        const mp32: IMp3 = { id: 456 };
        expectedResult = service.addMp3ToCollectionIfMissing([], mp3, mp32);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(mp3);
        expect(expectedResult).toContain(mp32);
      });

      it('should accept null and undefined values', () => {
        const mp3: IMp3 = { id: 123 };
        expectedResult = service.addMp3ToCollectionIfMissing([], null, mp3, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(mp3);
      });

      it('should return initial array if no Mp3 is added', () => {
        const mp3Collection: IMp3[] = [{ id: 123 }];
        expectedResult = service.addMp3ToCollectionIfMissing(mp3Collection, undefined, null);
        expect(expectedResult).toEqual(mp3Collection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
