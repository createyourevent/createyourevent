import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ElementRef } from '@angular/core';
import { Validators, UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IAddress } from 'app/entities/address/address.model';
import { AddressService } from 'app/entities/address/service/address.service';
import { ILocation } from 'app/entities/location/location.model';
import { LocationService } from 'app/entities/location/service/location.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { JhiDataUtils, JhiEventManager, JhiFileLoadError, JhiEventWithContent } from 'ng-jhipster';
import { Observable } from 'rxjs';
import { EventService as EventUserService } from './event.service';

@Component({
  selector: 'jhi-edit-location-update',
  templateUrl: './location-update.component.html',
})
export class EditLocationUpdateComponent implements OnInit {
  isSaving = false;
  location!: ILocation;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    description: [null, [Validators.required]],
    photo: [],
    photoContentType: [],
    address: [],
  });

  modules = {};

  constructor(
    private route: ActivatedRoute,
    private eventUserService: EventUserService,
    protected dataUtils: JhiDataUtils,
    protected eventManager: JhiEventManager,
    protected locationService: LocationService,
    protected addressService: AddressService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    private fb: UntypedFormBuilder,
    private router: Router
  ) {
    this.modules = {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'], // toggled buttons
        ['blockquote', 'code-block'],

        [{ header: 1 }, { header: 2 }], // custom button values
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
        [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
        [{ direction: 'rtl' }], // text direction

        [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
        [{ header: [1, 2, 3, 4, 5, 6, false] }],

        [{ color: [] }, { background: [] }], // dropdown with defaults from theme
        [{ font: [] }],
        [{ align: [] }],

        ['clean'], // remove formatting button

        ['link', 'video'], // link and image, video
      ],
    };
  }

  ngOnInit(): void {
    let eventId = 0;
    this.route.params.subscribe(params => {
      eventId = params['eventId'];

      this.eventUserService.findLocationByEventId(eventId).subscribe(location => {
        this.location = location.body!;
        this.updateForm();
      });
    });
  }

  updateForm(): void {
    this.editForm.patchValue({
      id: this.location.id,
      name: this.location.name,
      description: this.location.description,
      photo: this.location.photo,
      photoContentType: this.location.photoContentType,
      address: this.location.address,
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

  editAddress(): void {
    this.router.navigate(['/events/' + this.location.id + '/edit-address']);
  }

  save(): void {
    this.isSaving = true;
    const location = this.createFromForm();
    if (location.id !== undefined) {
      this.subscribeToSaveResponse(this.locationService.update(location));
    } else {
      this.subscribeToSaveResponse(this.locationService.create(location));
    }
  }

  private createFromForm(): ILocation {
    return {
      ...new Location(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      description: this.editForm.get(['description'])!.value,
      photoContentType: this.editForm.get(['photoContentType'])!.value,
      photo: this.editForm.get(['photo'])!.value,
      address: this.editForm.get(['address'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILocation>>): void {
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

  trackById(index: number, item: IAddress): any {
    return item.id;
  }
}
