import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ShopLikeDislikeDetailComponent } from './shop-like-dislike-detail.component';

describe('ShopLikeDislike Management Detail Component', () => {
  let comp: ShopLikeDislikeDetailComponent;
  let fixture: ComponentFixture<ShopLikeDislikeDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShopLikeDislikeDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ shopLikeDislike: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ShopLikeDislikeDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ShopLikeDislikeDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load shopLikeDislike on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.shopLikeDislike).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
