import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ProductStarRatingDetailComponent } from './product-star-rating-detail.component';

describe('ProductStarRating Management Detail Component', () => {
  let comp: ProductStarRatingDetailComponent;
  let fixture: ComponentFixture<ProductStarRatingDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductStarRatingDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ productStarRating: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ProductStarRatingDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ProductStarRatingDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load productStarRating on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.productStarRating).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
