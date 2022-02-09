import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { OrganizationStarRatingDetailComponent } from './organization-star-rating-detail.component';

describe('OrganizationStarRating Management Detail Component', () => {
  let comp: OrganizationStarRatingDetailComponent;
  let fixture: ComponentFixture<OrganizationStarRatingDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrganizationStarRatingDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ organizationStarRating: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(OrganizationStarRatingDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(OrganizationStarRatingDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load organizationStarRating on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.organizationStarRating).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
