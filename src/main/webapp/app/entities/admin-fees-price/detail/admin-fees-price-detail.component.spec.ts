import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AdminFeesPriceDetailComponent } from './admin-fees-price-detail.component';

describe('AdminFeesPrice Management Detail Component', () => {
  let comp: AdminFeesPriceDetailComponent;
  let fixture: ComponentFixture<AdminFeesPriceDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminFeesPriceDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ adminFeesPrice: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(AdminFeesPriceDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(AdminFeesPriceDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load adminFeesPrice on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.adminFeesPrice).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
