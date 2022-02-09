import { HttpResponse } from "@angular/common/http";
import { Component, OnInit, ElementRef } from "@angular/core";
import { Validators, FormBuilder } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { DATE_TIME_FORMAT } from "app/config/input.constants";
import { IEvent, Event as Party } from "app/entities/event/event.model";
import { EventService } from "app/entities/event/service/event.service";
import { ILocation } from "app/entities/location/location.model";
import { LocationService } from "app/entities/location/service/location.service";
import { IProduct } from "app/entities/product/product.model";
import { ProductService } from "app/entities/product/service/product.service";
import { TagsService } from "app/entities/tags/service/tags.service";
import { Tags } from "app/entities/tags/tags.model";
import { IUser } from "app/entities/user/user.model";
import { UserService } from "app/entities/user/user.service";
import { GeneralService } from "app/general.service";
import { AlertError } from "app/shared/alert/alert-error.model";
import { JhiDataUtils, JhiEventManager, JhiFileLoadError, JhiEventWithContent } from "ng-jhipster";
import { Observable } from "rxjs";
import * as dayjs from "dayjs";
import { EventStatus } from "app/entities/enumerations/event-status.model";


type SelectableEntity = ILocation | IUser | IProduct;

@Component({
  selector: 'jhi-event-update',
  templateUrl: './event-update.component.html'
})
export class EventUpdateComponent implements OnInit {
  isSaving = false;
  event!: IEvent;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    motto: [null, [Validators.required]],
    description: [null, [Validators.required]],
    dateStart: [null, [Validators.required]],
    dateEnd: [null, [Validators.required]],
    category: [null, [Validators.required]],
    price: [null, [Validators.required]],
    flyer: [],
    flyerContentType: [],
    youtube: [],
    privateOrPublic: [null, [Validators.required]],
    active: [],
    minPlacenumber: [null, [Validators.required]],
    placenumber: [null, [Validators.required]],
    investment: [null, [Validators.required]],
    status: [],
    definitelyConfirmed: [],
    location: [],
    wishlist: [],
    eventDetail: [],
    user: []
  });

  items: any[] = [];

  modules = {};

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
    private generalService: GeneralService,
    private tagsService: TagsService
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
        [{ header: [2, 3, 4, 5, 6, false] }],

        [{ color: [] }, { background: [] }], // dropdown with defaults from theme
        [{ font: [] }],
        [{ align: [] }],

        ['clean'], // remove formatting button

        ['link', 'video'] // link and image, video
      ]
    };
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(event => {
      this.event = event.event;
      this.generalService.findEventTags(this.event.id!).subscribe(e => {
        const eventTags = e.body;
        eventTags!.forEach(eventTag => {
          {
            this.items.push({ display: eventTag.tag, value: eventTag.tag });
          }
        });
      });
      this.updateForm(this.event);
    });
  }

  isEventDefinitiv() : boolean {
    return this.event.definitelyConfirmed === true && this.event.status === EventStatus.DEFINITELY;
  }

  updateForm(event: IEvent): void {
    this.editForm.patchValue({
      id: event.id,
      name: event.name,
      motto: event.motto,
      description: event.description,
      dateStart: event.dateStart ? event.dateStart.format(DATE_TIME_FORMAT) : null,
      dateEnd: event.dateEnd ? event.dateEnd.format(DATE_TIME_FORMAT) : null,
      category: event.category,
      price: event.price,
      flyer: event.flyer,
      flyerContentType: event.flyerContentType,
      youtube: event.youtube,
      privateOrPublic: event.privateOrPublic,
      active: event.active,
      minPlacenumber: event.minPlacenumber,
      placenumber: event.placenumber,
      investment: event.investment,
      status: event.status,
      definitelyConfirmed: event.definitelyConfirmed,
      location: event.location,
      eventDetail: event.eventDetail,
      user: event.user
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

  editLocation(): void {
    this.router.navigate(['/events/' + this.event.id + '/edit-location']);
  }

  editProducts(): void {
    this.router.navigate(['/events/' + this.event.id + '/edit-products']);
  }

  editServices(): void {
    this.router.navigate(['/events/' + this.event.id + '/edit-services']);
  }

  save(): void {
    this.isSaving = true;
    const event = this.createFromForm();
    if (event.id !== undefined) {
      this.subscribeToSaveResponse(this.eventService.update(event));
    } else {
      this.subscribeToSaveResponse(this.eventService.create(event));
    }
  }

  private createFromForm(): IEvent {
    return {
      ...new Party(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      motto: this.editForm.get(['motto'])!.value,
      description: this.editForm.get(['description'])!.value,
      dateStart: this.editForm.get(['dateStart'])!.value ? dayjs(this.editForm.get(['dateStart'])!.value, DATE_TIME_FORMAT) : undefined,
      dateEnd: this.editForm.get(['dateEnd'])!.value ? dayjs(this.editForm.get(['dateEnd'])!.value, DATE_TIME_FORMAT) : undefined,
      category: this.editForm.get(['category'])!.value,
      price: this.editForm.get(['price'])!.value,
      flyerContentType: this.editForm.get(['flyerContentType'])!.value,
      flyer: this.editForm.get(['flyer'])!.value,
      youtube: this.editForm.get(['youtube'])!.value,
      privateOrPublic: this.editForm.get(['privateOrPublic'])!.value,
      active: this.editForm.get(['active'])!.value,
      minPlacenumber: this.editForm.get(['minPlacenumber'])!.value,
      placenumber: this.editForm.get(['placenumber'])!.value,
      investment: this.editForm.get(['investment'])!.value,
      status: this.editForm.get(['status'])!.value,
      definitelyConfirmed: this.editForm.get(['definitelyConfirmed'])!.value,
      location: this.editForm.get(['location'])!.value,
      eventDetail: this.editForm.get(['eventDetail'])!.value,
      user: this.editForm.get(['user'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEvent>>): void {
    result.subscribe(
      e => this.onSaveSuccess(e.body!),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(e: IEvent): void {
    this.generalService.deleteEventTag(e.id!).subscribe(() => {
      this.items.forEach(item => {
        const tag = new Tags();
        tag.event = e;
        tag.tag = item.value;
        this.tagsService.create(tag).subscribe(() => {
          this.isSaving = false;
          this.router.navigate(['/organisator/dashboard']);
        });
      });
    });
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  trackById(index: number, item: SelectableEntity): any {
    return item.id;
  }
}
