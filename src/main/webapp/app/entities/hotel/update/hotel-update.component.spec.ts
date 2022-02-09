jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { HotelService } from '../service/hotel.service';
import { IHotel, Hotel } from '../hotel.model';
import { IOrganization } from 'app/entities/organization/organization.model';
import { OrganizationService } from 'app/entities/organization/service/organization.service';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { HotelUpdateComponent } from './hotel-update.component';

describe('Hotel Management Update Component', () => {
  let comp: HotelUpdateComponent;
  let fixture: ComponentFixture<HotelUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let hotelService: HotelService;
  let organizationService: OrganizationService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [HotelUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(HotelUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(HotelUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    hotelService = TestBed.inject(HotelService);
    organizationService = TestBed.inject(OrganizationService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call organization query and add missing value', () => {
      const hotel: IHotel = { id: 456 };
      const organization: IOrganization = { id: 95659 };
      hotel.organization = organization;

      const organizationCollection: IOrganization[] = [{ id: 70971 }];
      jest.spyOn(organizationService, 'query').mockReturnValue(of(new HttpResponse({ body: organizationCollection })));
      const expectedCollection: IOrganization[] = [organization, ...organizationCollection];
      jest.spyOn(organizationService, 'addOrganizationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ hotel });
      comp.ngOnInit();

      expect(organizationService.query).toHaveBeenCalled();
      expect(organizationService.addOrganizationToCollectionIfMissing).toHaveBeenCalledWith(organizationCollection, organization);
      expect(comp.organizationsCollection).toEqual(expectedCollection);
    });

    it('Should call User query and add missing value', () => {
      const hotel: IHotel = { id: 456 };
      const user: IUser = { id: 'c620ee4c-0d37-495e-8f51-0e73f84ed682' };
      hotel.user = user;

      const userCollection: IUser[] = [{ id: 'a8b7eb12-c5b5-4df5-86be-a3c490951bd5' }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ hotel });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const hotel: IHotel = { id: 456 };
      const organization: IOrganization = { id: 73754 };
      hotel.organization = organization;
      const user: IUser = { id: '5c3dd09f-633f-4059-9694-1499a974c463' };
      hotel.user = user;

      activatedRoute.data = of({ hotel });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(hotel));
      expect(comp.organizationsCollection).toContain(organization);
      expect(comp.usersSharedCollection).toContain(user);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Hotel>>();
      const hotel = { id: 123 };
      jest.spyOn(hotelService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ hotel });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: hotel }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(hotelService.update).toHaveBeenCalledWith(hotel);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Hotel>>();
      const hotel = new Hotel();
      jest.spyOn(hotelService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ hotel });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: hotel }));
      saveSubject.complete();

      // THEN
      expect(hotelService.create).toHaveBeenCalledWith(hotel);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Hotel>>();
      const hotel = { id: 123 };
      jest.spyOn(hotelService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ hotel });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(hotelService.update).toHaveBeenCalledWith(hotel);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackOrganizationById', () => {
      it('Should return tracked Organization primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackOrganizationById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackUserById', () => {
      it('Should return tracked User primary key', () => {
        const entity = { id: 'ABC' };
        const trackResult = comp.trackUserById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
