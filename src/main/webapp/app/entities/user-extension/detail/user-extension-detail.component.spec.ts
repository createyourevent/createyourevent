import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { UserExtensionDetailComponent } from './user-extension-detail.component';

describe('UserExtension Management Detail Component', () => {
  let comp: UserExtensionDetailComponent;
  let fixture: ComponentFixture<UserExtensionDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserExtensionDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ userExtension: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(UserExtensionDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(UserExtensionDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load userExtension on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.userExtension).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
