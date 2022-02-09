jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { RestaurantService } from '../service/restaurant.service';
import { IRestaurant, Restaurant } from '../restaurant.model';
import { IOrganization } from 'app/entities/organization/organization.model';
import { OrganizationService } from 'app/entities/organization/service/organization.service';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { RestaurantUpdateComponent } from './restaurant-update.component';

describe('Restaurant Management Update Component', () => {
  let comp: RestaurantUpdateComponent;
  let fixture: ComponentFixture<RestaurantUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let restaurantService: RestaurantService;
  let organizationService: OrganizationService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [RestaurantUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(RestaurantUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(RestaurantUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    restaurantService = TestBed.inject(RestaurantService);
    organizationService = TestBed.inject(OrganizationService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call organization query and add missing value', () => {
      const restaurant: IRestaurant = { id: 456 };
      const organization: IOrganization = { id: 24352 };
      restaurant.organization = organization;

      const organizationCollection: IOrganization[] = [{ id: 53234 }];
      jest.spyOn(organizationService, 'query').mockReturnValue(of(new HttpResponse({ body: organizationCollection })));
      const expectedCollection: IOrganization[] = [organization, ...organizationCollection];
      jest.spyOn(organizationService, 'addOrganizationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ restaurant });
      comp.ngOnInit();

      expect(organizationService.query).toHaveBeenCalled();
      expect(organizationService.addOrganizationToCollectionIfMissing).toHaveBeenCalledWith(organizationCollection, organization);
      expect(comp.organizationsCollection).toEqual(expectedCollection);
    });

    it('Should call User query and add missing value', () => {
      const restaurant: IRestaurant = { id: 456 };
      const user: IUser = { id: '2eee781f-146f-4451-96c3-1d3269d66445' };
      restaurant.user = user;

      const userCollection: IUser[] = [{ id: '3c9651e3-6abf-4384-9dcc-c68669b42217' }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ restaurant });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const restaurant: IRestaurant = { id: 456 };
      const organization: IOrganization = { id: 1102 };
      restaurant.organization = organization;
      const user: IUser = { id: '4a94968f-7977-409a-9d8e-66131d45155c' };
      restaurant.user = user;

      activatedRoute.data = of({ restaurant });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(restaurant));
      expect(comp.organizationsCollection).toContain(organization);
      expect(comp.usersSharedCollection).toContain(user);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Restaurant>>();
      const restaurant = { id: 123 };
      jest.spyOn(restaurantService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ restaurant });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: restaurant }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(restaurantService.update).toHaveBeenCalledWith(restaurant);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Restaurant>>();
      const restaurant = new Restaurant();
      jest.spyOn(restaurantService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ restaurant });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: restaurant }));
      saveSubject.complete();

      // THEN
      expect(restaurantService.create).toHaveBeenCalledWith(restaurant);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Restaurant>>();
      const restaurant = { id: 123 };
      jest.spyOn(restaurantService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ restaurant });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(restaurantService.update).toHaveBeenCalledWith(restaurant);
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
