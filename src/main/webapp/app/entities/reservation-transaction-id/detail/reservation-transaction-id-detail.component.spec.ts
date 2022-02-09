import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ReservationTransactionIdDetailComponent } from './reservation-transaction-id-detail.component';

describe('ReservationTransactionId Management Detail Component', () => {
  let comp: ReservationTransactionIdDetailComponent;
  let fixture: ComponentFixture<ReservationTransactionIdDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReservationTransactionIdDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ reservationTransactionId: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ReservationTransactionIdDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ReservationTransactionIdDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load reservationTransactionId on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.reservationTransactionId).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
