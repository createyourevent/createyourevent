import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { Mp3DetailComponent } from './mp-3-detail.component';

describe('Mp3 Management Detail Component', () => {
  let comp: Mp3DetailComponent;
  let fixture: ComponentFixture<Mp3DetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Mp3DetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ mp3: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(Mp3DetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(Mp3DetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load mp3 on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.mp3).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
