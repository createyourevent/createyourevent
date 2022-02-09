import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { GiftShoppingCartDetailComponent } from './gift-shopping-cart-detail.component';

describe('GiftShoppingCart Management Detail Component', () => {
  let comp: GiftShoppingCartDetailComponent;
  let fixture: ComponentFixture<GiftShoppingCartDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GiftShoppingCartDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ giftShoppingCart: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(GiftShoppingCartDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(GiftShoppingCartDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load giftShoppingCart on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.giftShoppingCart).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
