import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { FeeTransactionEntryDetailComponent } from './fee-transaction-entry-detail.component';

describe('FeeTransactionEntry Management Detail Component', () => {
  let comp: FeeTransactionEntryDetailComponent;
  let fixture: ComponentFixture<FeeTransactionEntryDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FeeTransactionEntryDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ feeTransactionEntry: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(FeeTransactionEntryDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(FeeTransactionEntryDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load feeTransactionEntry on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.feeTransactionEntry).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
