import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IChipsCollectionChips, ChipsCollectionChips } from '../chips-collection-chips.model';
import { ChipsCollectionChipsService } from '../service/chips-collection-chips.service';
import { IChipsCollection } from 'app/entities/chips-collection/chips-collection.model';
import { ChipsCollectionService } from 'app/entities/chips-collection/service/chips-collection.service';
import { IChips } from 'app/entities/chips/chips.model';
import { ChipsService } from 'app/entities/chips/service/chips.service';

@Component({
  selector: 'jhi-chips-collection-chips-update',
  templateUrl: './chips-collection-chips-update.component.html',
})
export class ChipsCollectionChipsUpdateComponent implements OnInit {
  isSaving = false;

  chipsCollectionsSharedCollection: IChipsCollection[] = [];
  chipsSharedCollection: IChips[] = [];

  editForm = this.fb.group({
    id: [],
    chipsCollection: [],
    chips: [],
  });

  constructor(
    protected chipsCollectionChipsService: ChipsCollectionChipsService,
    protected chipsCollectionService: ChipsCollectionService,
    protected chipsService: ChipsService,
    protected activatedRoute: ActivatedRoute,
    protected fb: UntypedFormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ chipsCollectionChips }) => {
      this.updateForm(chipsCollectionChips);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const chipsCollectionChips = this.createFromForm();
    if (chipsCollectionChips.id !== undefined) {
      this.subscribeToSaveResponse(this.chipsCollectionChipsService.update(chipsCollectionChips));
    } else {
      this.subscribeToSaveResponse(this.chipsCollectionChipsService.create(chipsCollectionChips));
    }
  }

  trackChipsCollectionById(index: number, item: IChipsCollection): number {
    return item.id!;
  }

  trackChipsById(index: number, item: IChips): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IChipsCollectionChips>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(chipsCollectionChips: IChipsCollectionChips): void {
    this.editForm.patchValue({
      id: chipsCollectionChips.id,
      chipsCollection: chipsCollectionChips.chipsCollection,
      chips: chipsCollectionChips.chips,
    });

    this.chipsCollectionsSharedCollection = this.chipsCollectionService.addChipsCollectionToCollectionIfMissing(
      this.chipsCollectionsSharedCollection,
      chipsCollectionChips.chipsCollection
    );
    this.chipsSharedCollection = this.chipsService.addChipsToCollectionIfMissing(this.chipsSharedCollection, chipsCollectionChips.chips);
  }

  protected loadRelationshipsOptions(): void {
    this.chipsCollectionService
      .query()
      .pipe(map((res: HttpResponse<IChipsCollection[]>) => res.body ?? []))
      .pipe(
        map((chipsCollections: IChipsCollection[]) =>
          this.chipsCollectionService.addChipsCollectionToCollectionIfMissing(chipsCollections, this.editForm.get('chipsCollection')!.value)
        )
      )
      .subscribe((chipsCollections: IChipsCollection[]) => (this.chipsCollectionsSharedCollection = chipsCollections));

    this.chipsService
      .query()
      .pipe(map((res: HttpResponse<IChips[]>) => res.body ?? []))
      .pipe(map((chips: IChips[]) => this.chipsService.addChipsToCollectionIfMissing(chips, this.editForm.get('chips')!.value)))
      .subscribe((chips: IChips[]) => (this.chipsSharedCollection = chips));
  }

  protected createFromForm(): IChipsCollectionChips {
    return {
      ...new ChipsCollectionChips(),
      id: this.editForm.get(['id'])!.value,
      chipsCollection: this.editForm.get(['chipsCollection'])!.value,
      chips: this.editForm.get(['chips'])!.value,
    };
  }
}
