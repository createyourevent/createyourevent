import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { JhiDataUtils, JhiFileLoadError, JhiEventManager, JhiEventWithContent } from 'ng-jhipster';

import { AlertError } from 'app/shared/alert/alert-error.model';
import { SharedEventService } from './shared-event.service';
import { ILocation } from 'app/entities/location/location.model';
import { LocationService } from 'app/entities/location/service/location.service';
import { IProduct } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/service/product.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { EventService } from 'app/views/event/event.service';
import { ValidateFileSizeService } from 'app/validators/ValidateFileSize.service';

@Component({
  selector: 'jhi-event-flyer',
  templateUrl: './flyer.component.html',
  styleUrls: ['./flyer.scss']
})
export class FlyerComponent implements OnInit, OnDestroy {
  isSaving = false;
  locations: ILocation[] = [];
  users: IUser[] = [];
  products: IProduct[] = [];
  dateStartDp: any;
  dateEndDp: any;
  model: any;

  editForm = this.fb.group({
    flyer: [null, [this.validateFileSizeService.valFileSize(256000)]],
    flyerContentType: [],
    youtube: []
  });

  constructor(
    protected dataUtils: JhiDataUtils,
    protected eventManager: JhiEventManager,
    protected eventService: EventService,
    protected locationService: LocationService,
    protected userService: UserService,
    protected productService: ProductService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    protected sharedEventService: SharedEventService,
    private validateFileSizeService: ValidateFileSizeService
  ) {}

  ngOnInit(): void {
    this.model = this.sharedEventService.sharedEvent;
    this.updateForm();
  }

  ngOnDestroy(): void {}

  updateForm(): void {
    this.editForm.patchValue({
      flyer: this.sharedEventService.sharedFlyer,
      flyerContentType: this.sharedEventService.sharedFlyerContentType
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
    this.router.navigate(['/organisator/create-event']);
  }

  save(): void {
    const flyerContentType = this.editForm.get(['flyerContentType'])!.value;
    const flyer = this.editForm.get(['flyer'])!.value;
    const youtube = this.editForm.get(['youtube'])!.value;

    this.sharedEventService.sharedYoutube = youtube;
    this.sharedEventService.sharedFlyer = flyer;
    this.sharedEventService.sharedFlyerContentType = flyerContentType;

    if(this.model.price === 0 && this.model.investment === 0) {
      this.router.navigate(['/organisator/create-event/overview']);
    } else {
      this.router.navigate(['/organisator/create-event/products-services']);
    }
  }
}
