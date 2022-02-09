import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { OrganizationReservationDetailComponent } from './organization-reservation-detail.component';

describe('OrganizationReservation Management Detail Component', () => {
  let comp: OrganizationReservationDetailComponent;
  let fixture: ComponentFixture<OrganizationReservationDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrganizationReservationDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ organizationReservation: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(OrganizationReservationDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(OrganizationReservationDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load organizationReservation on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.organizationReservation).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
