import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ServiceStarRatingDetailComponent } from './service-star-rating-detail.component';

describe('ServiceStarRating Management Detail Component', () => {
  let comp: ServiceStarRatingDetailComponent;
  let fixture: ComponentFixture<ServiceStarRatingDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ServiceStarRatingDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ serviceStarRating: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ServiceStarRatingDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ServiceStarRatingDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load serviceStarRating on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.serviceStarRating).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
