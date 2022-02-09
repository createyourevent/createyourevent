import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { FeeBalanceDetailComponent } from './fee-balance-detail.component';

describe('FeeBalance Management Detail Component', () => {
  let comp: FeeBalanceDetailComponent;
  let fixture: ComponentFixture<FeeBalanceDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FeeBalanceDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ feeBalance: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(FeeBalanceDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(FeeBalanceDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load feeBalance on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.feeBalance).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
