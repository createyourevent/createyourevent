import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { JhiDataUtils, JhiFileLoadError, JhiEventManager, JhiEventWithContent } from 'ng-jhipster';

import { AlertError } from 'app/shared/alert/alert-error.model';
import { IChips, Chips } from 'app/entities/chips/chips.model';
import { ChipsService } from 'app/entities/chips/service/chips.service';

@Component({
  selector: 'jhi-chips-update',
  templateUrl: './chips-update.component.html'
})
export class ChipsUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    points: [],
    website: [],
    x: [],
    y: [],
    image: [],
    imageContentType: [],
    color: []
  });

  constructor(
    protected dataUtils: JhiDataUtils,
    protected eventManager: JhiEventManager,
    protected chipsService: ChipsService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ chips }) => {
      this.updateForm(chips);
    });
  }

  updateForm(chips: IChips): void {
    this.editForm.patchValue({
      id: chips.id,
      points: chips.points,
      website: chips.website,
      x: chips.x,
      y: chips.y,
      image: chips.image,
      imageContentType: chips.imageContentType,
      color: chips.color
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(contentType: string, base64String: string): void {
    this.dataUtils.openFile(contentType, base64String);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe(null, (err: JhiFileLoadError) => {
      this.eventManager.broadcast(
        new JhiEventWithContent<AlertError>('createyoureventApp.error', { ...err, key: 'error.file.' + err.key })
      );
    });
  }

  clearInputImage(field: string, fieldContentType: string, idInput: string): void {
    this.editForm.patchValue({
      [field]: null,
      [fieldContentType]: null
    });
    if (this.elementRef && idInput && this.elementRef.nativeElement.querySelector('#' + idInput)) {
      this.elementRef.nativeElement.querySelector('#' + idInput).value = null;
    }
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const chips = this.createFromForm();
    if (chips.id !== undefined) {
      this.subscribeToSaveResponse(this.chipsService.update(chips));
    } else {
      this.subscribeToSaveResponse(this.chipsService.create(chips));
    }
  }

  private createFromForm(): IChips {
    return {
      ...new Chips(),
      id: this.editForm.get(['id'])!.value,
      points: this.editForm.get(['points'])!.value,
      website: this.editForm.get(['website'])!.value,
      x: this.editForm.get(['x'])!.value,
      y: this.editForm.get(['y'])!.value,
      imageContentType: this.editForm.get(['imageContentType'])!.value,
      image: this.editForm.get(['image'])!.value,
      color: this.editForm.get(['color'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IChips>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }
}
