import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IHotel, Hotel } from '../hotel.model';

import { HotelService } from './hotel.service';

describe('Hotel Service', () => {
  let service: HotelService;
  let httpMock: HttpTestingController;
  let elemDefault: IHotel;
  let expectedResult: IHotel | IHotel[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(HotelService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      menu: 'AAAAAAA',
      placesToSleep: 0,
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

    it('should create a Hotel', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Hotel()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Hotel', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          menu: 'BBBBBB',
          placesToSleep: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Hotel', () => {
      const patchObject = Object.assign(
        {
          placesToSleep: 1,
        },
        new Hotel()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Hotel', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          menu: 'BBBBBB',
          placesToSleep: 1,
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

    it('should delete a Hotel', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addHotelToCollectionIfMissing', () => {
      it('should add a Hotel to an empty array', () => {
        const hotel: IHotel = { id: 123 };
        expectedResult = service.addHotelToCollectionIfMissing([], hotel);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(hotel);
      });

      it('should not add a Hotel to an array that contains it', () => {
        const hotel: IHotel = { id: 123 };
        const hotelCollection: IHotel[] = [
          {
            ...hotel,
          },
          { id: 456 },
        ];
        expectedResult = service.addHotelToCollectionIfMissing(hotelCollection, hotel);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Hotel to an array that doesn't contain it", () => {
        const hotel: IHotel = { id: 123 };
        const hotelCollection: IHotel[] = [{ id: 456 }];
        expectedResult = service.addHotelToCollectionIfMissing(hotelCollection, hotel);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(hotel);
      });

      it('should add only unique Hotel to an array', () => {
        const hotelArray: IHotel[] = [{ id: 123 }, { id: 456 }, { id: 16245 }];
        const hotelCollection: IHotel[] = [{ id: 123 }];
        expectedResult = service.addHotelToCollectionIfMissing(hotelCollection, ...hotelArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const hotel: IHotel = { id: 123 };
        const hotel2: IHotel = { id: 456 };
        expectedResult = service.addHotelToCollectionIfMissing([], hotel, hotel2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(hotel);
        expect(expectedResult).toContain(hotel2);
      });

      it('should accept null and undefined values', () => {
        const hotel: IHotel = { id: 123 };
        expectedResult = service.addHotelToCollectionIfMissing([], null, hotel, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(hotel);
      });

      it('should return initial array if no Hotel is added', () => {
        const hotelCollection: IHotel[] = [{ id: 123 }];
        expectedResult = service.addHotelToCollectionIfMissing(hotelCollection, undefined, null);
        expect(expectedResult).toEqual(hotelCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
