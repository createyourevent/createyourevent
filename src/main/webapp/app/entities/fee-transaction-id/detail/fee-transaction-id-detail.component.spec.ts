import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { FeeTransactionIdDetailComponent } from './fee-transaction-id-detail.component';

describe('FeeTransactionId Management Detail Component', () => {
  let comp: FeeTransactionIdDetailComponent;
  let fixture: ComponentFixture<FeeTransactionIdDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FeeTransactionIdDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ feeTransactionId: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(FeeTransactionIdDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(FeeTransactionIdDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load feeTransactionId on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.feeTransactionId).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
