import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ElementRef } from '@angular/core';
import { Validators, UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ADDRESS_REGEX } from 'app/constants';
import { IPartner, Partner } from 'app/entities/partner/partner.model';
import { PartnerService } from 'app/entities/partner/service/partner.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { ValidateImageWidthHeightService } from 'app/validators/ValidateImageWidthHeight.service';
import { ValidatorHttp } from 'app/validators/ValidatorHttp.service';
import { JhiDataUtils, JhiEventManager, JhiFileLoadError, JhiEventWithContent } from 'ng-jhipster';
import { Observable } from 'rxjs';

@Component({
  selector: 'jhi-register-partner',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  isSaving = false;

  formattedaddress = '';

  editForm = this.fb.group(
    {
      id: [],
      name: [null, [Validators.required]],
      address: [null, [Validators.required, Validators.pattern(ADDRESS_REGEX)]],
      phone: [null, [Validators.required]],
      logo: [null, [Validators.required]],
      logoContentType: [],
      mail: [null, [Validators.required]],
      webaddress: [null, [this.validatorHttp.checkHttp()]],
      sponsorshipAmount: [],
    },
    { validator: this.validateImageWidthHeightService.validateProductImageWidthHeightPartner(400, 250) }
  );

  constructor(
    protected dataUtils: JhiDataUtils,
    protected eventManager: JhiEventManager,
    protected partnerService: PartnerService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    private fb: UntypedFormBuilder,
    private validateImageWidthHeightService: ValidateImageWidthHeightService,
    private validatorHttp: ValidatorHttp
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ partner }) => {
      this.updateForm(partner);
    });
  }

  updateForm(partner: IPartner): void {
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
      [fieldContentType]: null,
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
    const partner = this.createFromForm();
    this.subscribeToSaveResponse(this.partnerService.create(partner));
  }

  private createFromForm(): IPartner {
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
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPartner>>): void {
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

  public addressChange(address: any): void {
    this.formattedaddress = address.formatted_address;
    this.editForm.patchValue({ address: address.formatted_address });
  }
}
