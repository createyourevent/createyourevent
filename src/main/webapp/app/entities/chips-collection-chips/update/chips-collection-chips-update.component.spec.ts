jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ChipsCollectionChipsService } from '../service/chips-collection-chips.service';
import { IChipsCollectionChips, ChipsCollectionChips } from '../chips-collection-chips.model';
import { IChipsCollection } from 'app/entities/chips-collection/chips-collection.model';
import { ChipsCollectionService } from 'app/entities/chips-collection/service/chips-collection.service';
import { IChips } from 'app/entities/chips/chips.model';
import { ChipsService } from 'app/entities/chips/service/chips.service';

import { ChipsCollectionChipsUpdateComponent } from './chips-collection-chips-update.component';

describe('ChipsCollectionChips Management Update Component', () => {
  let comp: ChipsCollectionChipsUpdateComponent;
  let fixture: ComponentFixture<ChipsCollectionChipsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let chipsCollectionChipsService: ChipsCollectionChipsService;
  let chipsCollectionService: ChipsCollectionService;
  let chipsService: ChipsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ChipsCollectionChipsUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(ChipsCollectionChipsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ChipsCollectionChipsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    chipsCollectionChipsService = TestBed.inject(ChipsCollectionChipsService);
    chipsCollectionService = TestBed.inject(ChipsCollectionService);
    chipsService = TestBed.inject(ChipsService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call ChipsCollection query and add missing value', () => {
      const chipsCollectionChips: IChipsCollectionChips = { id: 456 };
      const chipsCollection: IChipsCollection = { id: 39022 };
      chipsCollectionChips.chipsCollection = chipsCollection;

      const chipsCollectionCollection: IChipsCollection[] = [{ id: 88051 }];
      jest.spyOn(chipsCollectionService, 'query').mockReturnValue(of(new HttpResponse({ body: chipsCollectionCollection })));
      const additionalChipsCollections = [chipsCollection];
      const expectedCollection: IChipsCollection[] = [...additionalChipsCollections, ...chipsCollectionCollection];
      jest.spyOn(chipsCollectionService, 'addChipsCollectionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ chipsCollectionChips });
      comp.ngOnInit();

      expect(chipsCollectionService.query).toHaveBeenCalled();
      expect(chipsCollectionService.addChipsCollectionToCollectionIfMissing).toHaveBeenCalledWith(
        chipsCollectionCollection,
        ...additionalChipsCollections
      );
      expect(comp.chipsCollectionsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Chips query and add missing value', () => {
      const chipsCollectionChips: IChipsCollectionChips = { id: 456 };
      const chips: IChips = { id: 36992 };
      chipsCollectionChips.chips = chips;

      const chipsCollection: IChips[] = [{ id: 20672 }];
      jest.spyOn(chipsService, 'query').mockReturnValue(of(new HttpResponse({ body: chipsCollection })));
      const additionalChips = [chips];
      const expectedCollection: IChips[] = [...additionalChips, ...chipsCollection];
      jest.spyOn(chipsService, 'addChipsToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ chipsCollectionChips });
      comp.ngOnInit();

      expect(chipsService.query).toHaveBeenCalled();
      expect(chipsService.addChipsToCollectionIfMissing).toHaveBeenCalledWith(chipsCollection, ...additionalChips);
      expect(comp.chipsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const chipsCollectionChips: IChipsCollectionChips = { id: 456 };
      const chipsCollection: IChipsCollection = { id: 1091 };
      chipsCollectionChips.chipsCollection = chipsCollection;
      const chips: IChips = { id: 89167 };
      chipsCollectionChips.chips = chips;

      activatedRoute.data = of({ chipsCollectionChips });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(chipsCollectionChips));
      expect(comp.chipsCollectionsSharedCollection).toContain(chipsCollection);
      expect(comp.chipsSharedCollection).toContain(chips);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ChipsCollectionChips>>();
      const chipsCollectionChips = { id: 123 };
      jest.spyOn(chipsCollectionChipsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ chipsCollectionChips });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: chipsCollectionChips }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(chipsCollectionChipsService.update).toHaveBeenCalledWith(chipsCollectionChips);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ChipsCollectionChips>>();
      const chipsCollectionChips = new ChipsCollectionChips();
      jest.spyOn(chipsCollectionChipsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ chipsCollectionChips });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: chipsCollectionChips }));
      saveSubject.complete();

      // THEN
      expect(chipsCollectionChipsService.create).toHaveBeenCalledWith(chipsCollectionChips);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ChipsCollectionChips>>();
      const chipsCollectionChips = { id: 123 };
      jest.spyOn(chipsCollectionChipsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ chipsCollectionChips });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(chipsCollectionChipsService.update).toHaveBeenCalledWith(chipsCollectionChips);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackChipsCollectionById', () => {
      it('Should return tracked ChipsCollection primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackChipsCollectionById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackChipsById', () => {
      it('Should return tracked Chips primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackChipsById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
