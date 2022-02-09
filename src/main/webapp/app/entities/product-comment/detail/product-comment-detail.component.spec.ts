import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ProductCommentDetailComponent } from './product-comment-detail.component';

describe('ProductComment Management Detail Component', () => {
  let comp: ProductCommentDetailComponent;
  let fixture: ComponentFixture<ProductCommentDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductCommentDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ productComment: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ProductCommentDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ProductCommentDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load productComment on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.productComment).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
