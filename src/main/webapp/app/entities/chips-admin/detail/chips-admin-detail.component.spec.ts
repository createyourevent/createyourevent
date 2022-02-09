import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ChipsAdminDetailComponent } from './chips-admin-detail.component';

describe('ChipsAdmin Management Detail Component', () => {
  let comp: ChipsAdminDetailComponent;
  let fixture: ComponentFixture<ChipsAdminDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChipsAdminDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ chipsAdmin: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ChipsAdminDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ChipsAdminDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load chipsAdmin on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.chipsAdmin).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
