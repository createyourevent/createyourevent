import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IPartner, Partner } from '../partner.model';
import { PartnerService } from '../service/partner.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-partner-update',
  templateUrl: './partner-update.component.html',
})
export class PartnerUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    address: [null, [Validators.required]],
    phone: [null, [Validators.required]],
    logo: [null, [Validators.required]],
    logoContentType: [],
    mail: [null, [Validators.required]],
    webaddress: [null, [Validators.required]],
    sponsorshipAmount: [],
    active: [],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected partnerService: PartnerService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected fb: UntypedFormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ partner }) => {
      this.updateForm(partner);
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('createyoureventApp.error', { ...err, key: 'error.file.' + err.key })),
    });
  }

  clearInputImage(field: string, fieldContentType: string, idInput: string): void {
    this.editForm.patchValue({
      [field]: null,
      [fieldContentType]: null,
    });
    if (idInput && this.elementRef.nativeElement.querySelector('#' + idInput)) {
      this.elementRef.nativeElement.querySelector('#' + idInput).value = null;
    }
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const partner = this.createFromForm();
    if (partner.id !== undefined) {
      this.subscribeToSaveResponse(this.partnerService.update(partner));
    } else {
      this.subscribeToSaveResponse(this.partnerService.create(partner));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPartner>>): void {
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

  protected updateForm(partner: IPartner): void {
    this.editForm.patchValue({
      id: partner.id,
      name: partner.name,
      address: partner.address,
      phone: partner.phone,
      logo: partner.logo,
      logoContentType: partner.logoContentType,
      mail: partner.mail,
      webaddress: partner.webaddress,
      sponsorshipAmount: partner.sponsorshipAmount,
      active: partner.active,
    });
  }

  protected createFromForm(): IPartner {
    return {
      ...new Partner(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      address: this.editForm.get(['address'])!.value,
      phone: this.editForm.get(['phone'])!.value,
      logoContentType: this.editForm.get(['logoContentType'])!.value,
      logo: this.editForm.get(['logo'])!.value,
      mail: this.editForm.get(['mail'])!.value,
      webaddress: this.editForm.get(['webaddress'])!.value,
      sponsorshipAmount: this.editForm.get(['sponsorshipAmount'])!.value,
      active: this.editForm.get(['active'])!.value,
    };
  }
}
