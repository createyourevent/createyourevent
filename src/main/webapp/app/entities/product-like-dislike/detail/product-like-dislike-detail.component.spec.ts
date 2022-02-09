import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ProductLikeDislikeDetailComponent } from './product-like-dislike-detail.component';

describe('ProductLikeDislike Management Detail Component', () => {
  let comp: ProductLikeDislikeDetailComponent;
  let fixture: ComponentFixture<ProductLikeDislikeDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductLikeDislikeDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ productLikeDislike: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ProductLikeDislikeDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ProductLikeDislikeDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load productLikeDislike on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.productLikeDislike).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
