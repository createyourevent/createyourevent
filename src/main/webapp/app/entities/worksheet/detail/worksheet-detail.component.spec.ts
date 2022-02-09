import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { WorksheetDetailComponent } from './worksheet-detail.component';

describe('Worksheet Management Detail Component', () => {
  let comp: WorksheetDetailComponent;
  let fixture: ComponentFixture<WorksheetDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WorksheetDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ worksheet: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(WorksheetDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(WorksheetDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load worksheet on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.worksheet).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
