import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ShopCommentDetailComponent } from './shop-comment-detail.component';

describe('ShopComment Management Detail Component', () => {
  let comp: ShopCommentDetailComponent;
  let fixture: ComponentFixture<ShopCommentDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShopCommentDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ shopComment: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ShopCommentDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ShopCommentDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load shopComment on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.shopComment).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
