import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ShopStarRatingDetailComponent } from './shop-star-rating-detail.component';

describe('ShopStarRating Management Detail Component', () => {
  let comp: ShopStarRatingDetailComponent;
  let fixture: ComponentFixture<ShopStarRatingDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShopStarRatingDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ shopStarRating: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ShopStarRatingDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ShopStarRatingDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load shopStarRating on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.shopStarRating).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
