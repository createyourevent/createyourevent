import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IEventDetails, EventDetails } from '../event-details.model';

import { EventDetailsService } from './event-details.service';

describe('EventDetails Service', () => {
  let service: EventDetailsService;
  let httpMock: HttpTestingController;
  let elemDefault: IEventDetails;
  let expectedResult: IEventDetails | IEventDetails[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(EventDetailsService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      totalEntranceFee: 0,
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

    it('should create a EventDetails', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new EventDetails()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a EventDetails', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          totalEntranceFee: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a EventDetails', () => {
      const patchObject = Object.assign(
        {
          totalEntranceFee: 1,
        },
        new EventDetails()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of EventDetails', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          totalEntranceFee: 1,
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

    it('should delete a EventDetails', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addEventDetailsToCollectionIfMissing', () => {
      it('should add a EventDetails to an empty array', () => {
        const eventDetails: IEventDetails = { id: 123 };
        expectedResult = service.addEventDetailsToCollectionIfMissing([], eventDetails);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(eventDetails);
      });

      it('should not add a EventDetails to an array that contains it', () => {
        const eventDetails: IEventDetails = { id: 123 };
        const eventDetailsCollection: IEventDetails[] = [
          {
            ...eventDetails,
          },
          { id: 456 },
        ];
        expectedResult = service.addEventDetailsToCollectionIfMissing(eventDetailsCollection, eventDetails);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a EventDetails to an array that doesn't contain it", () => {
        const eventDetails: IEventDetails = { id: 123 };
        const eventDetailsCollection: IEventDetails[] = [{ id: 456 }];
        expectedResult = service.addEventDetailsToCollectionIfMissing(eventDetailsCollection, eventDetails);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(eventDetails);
      });

      it('should add only unique EventDetails to an array', () => {
        const eventDetailsArray: IEventDetails[] = [{ id: 123 }, { id: 456 }, { id: 55749 }];
        const eventDetailsCollection: IEventDetails[] = [{ id: 123 }];
        expectedResult = service.addEventDetailsToCollectionIfMissing(eventDetailsCollection, ...eventDetailsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const eventDetails: IEventDetails = { id: 123 };
        const eventDetails2: IEventDetails = { id: 456 };
        expectedResult = service.addEventDetailsToCollectionIfMissing([], eventDetails, eventDetails2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(eventDetails);
        expect(expectedResult).toContain(eventDetails2);
      });

      it('should accept null and undefined values', () => {
        const eventDetails: IEventDetails = { id: 123 };
        expectedResult = service.addEventDetailsToCollectionIfMissing([], null, eventDetails, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(eventDetails);
      });

      it('should return initial array if no EventDetails is added', () => {
        const eventDetailsCollection: IEventDetails[] = [{ id: 123 }];
        expectedResult = service.addEventDetailsToCollectionIfMissing(eventDetailsCollection, undefined, null);
        expect(expectedResult).toEqual(eventDetailsCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
