import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { OrganizationLikeDislikeDetailComponent } from './organization-like-dislike-detail.component';

describe('OrganizationLikeDislike Management Detail Component', () => {
  let comp: OrganizationLikeDislikeDetailComponent;
  let fixture: ComponentFixture<OrganizationLikeDislikeDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrganizationLikeDislikeDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ organizationLikeDislike: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(OrganizationLikeDislikeDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(OrganizationLikeDislikeDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load organizationLikeDislike on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.organizationLikeDislike).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
