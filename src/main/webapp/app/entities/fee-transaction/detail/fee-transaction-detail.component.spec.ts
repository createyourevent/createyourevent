import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { FeeTransactionDetailComponent } from './fee-transaction-detail.component';

describe('FeeTransaction Management Detail Component', () => {
  let comp: FeeTransactionDetailComponent;
  let fixture: ComponentFixture<FeeTransactionDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FeeTransactionDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ feeTransaction: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(FeeTransactionDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(FeeTransactionDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load feeTransaction on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.feeTransaction).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
