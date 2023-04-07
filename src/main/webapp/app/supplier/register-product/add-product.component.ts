import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ElementRef } from '@angular/core';
import { Validators, UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { DeliveryType } from 'app/entities/delivery-type/delivery-type.model';
import { DeliveryTypeService } from 'app/entities/delivery-type/service/delivery-type.service';
import { DeliveryTypes } from 'app/entities/enumerations/delivery-types.model';
import { PriceType } from 'app/entities/enumerations/price-type.model';
import { IEvent } from 'app/entities/event/event.model';
import { IProduct, Product } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/service/product.service';
import { ShopService } from 'app/entities/shop/service/shop.service';
import { IShop } from 'app/entities/shop/shop.model';
import { TagsService } from 'app/entities/tags/service/tags.service';
import { Tags } from 'app/entities/tags/tags.model';
import { UserPointAssociationService } from 'app/entities/user-point-association/service/user-point-association.service';
import { UserPointAssociation } from 'app/entities/user-point-association/user-point-association.model';
import { GeneralService } from 'app/general.service';
import { PointsDataService } from 'app/points/points-display/points-display.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { ValidateFileSizeService } from 'app/validators/ValidateFileSize.service';
import { ValidateImageWidthHeightService } from 'app/validators/ValidateImageWidthHeight.service';
import { EventService } from 'app/views/event/event.service';
import * as dayjs from 'dayjs';
import { JhiDataUtils, JhiEventManager, JhiFileLoadError, JhiEventWithContent } from 'ng-jhipster';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';

type SelectableEntity = IEvent | IShop;

@Component({
  selector: 'jhi-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
  providers: [MessageService],
})
export class AddProductComponent implements OnInit {
  isSaving = false;
  saved = false;
  success = false;
  error = false;
  events: IEvent[] = [];
  shops: IShop[] = [];
  dateAddedDp: any;
  dateModifiedDp: any;
  shopId!: string;
  shop!: IShop;
  description!: string;

  quillEditorRef: any;
  maxUploadFileSize = 500000;

  tags?: string[];

  items!: any[];

  isRenting = false;

  public selectedDeliveryTypes: string[] = [];
  public minOrderQuantityShipping = 0;
  public minOrderQuantityDelivery = 0;
  public minOrderQuantityPickup = 0;
  public priceShipping = 0;
  public priceDelivery = 0;
  public pricePickup = 0;
  public priceDeliveryKilometre = 0;

  editForm = this.fb.group(
    {
      id: [],
      title: [null, [Validators.required]],
      keywords: [],
      description: [null, [Validators.required]],
      dateAdded: [],
      dateModified: [],
      priceType: [],
      rentType: [],
      price: [null, [Validators.required]],
      photo: [null, [Validators.required, this.validateFileSizeService.valFileSize(256000)]],
      photoContentType: [],
      photo2: [null, [this.validateFileSizeService.valFileSize(256000)]],
      photo2ContentType: [],
      photo3: [null, [this.validateFileSizeService.valFileSize(256000)]],
      photo3ContentType: [],
      youtube: [],
      active: [],
      stock: [null, [Validators.required]],
      productType: [],
      itemNumber: [],
      status: [],
      unit: [null, [Validators.required]],
      amount: [null, [Validators.required]],
      shop: [],
      motto: [null, [Validators.required]],
    },
    { validator: this.validateImageWidthHeightService.validateProductImageWidthHeight(600, 750) }
  );

  modules = {};

  constructor(
    protected dataUtils: JhiDataUtils,
    protected eventManager: JhiEventManager,
    protected productService: ProductService,
    protected eventService: EventService,
    protected shopService: ShopService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    private fb: UntypedFormBuilder,
    private route: ActivatedRoute,
    private tagsService: TagsService,
    private pointsDataService: PointsDataService,
    private userPointAssociationService: UserPointAssociationService,
    private generalService: GeneralService,
    private validateFileSizeService: ValidateFileSizeService,
    private messageService: MessageService,
    private translate: TranslateService,
    private validateImageWidthHeightService: ValidateImageWidthHeightService,
    private deliveryTypeService: DeliveryTypeService
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

        ['link', 'image', 'video'], // link and image, video
      ],
    };
  }

  ngOnInit(): void {
    this.shopId = this.route.snapshot.paramMap.get('shopId')!;
    this.shopService.find(Number(this.shopId)).subscribe(s => {
      this.shop = s.body!;
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

  getEditorInstance(editorInstance: any): void {
    this.quillEditorRef = editorInstance;
    const toolbar = editorInstance.getModule('toolbar');
    toolbar.addHandler('image', this.imageHandler);
  }

  imageHandler = (image: any, callback: any) => {
    const input = <HTMLInputElement>document.getElementById('fileInputField');
    document.getElementById('fileInputField')!.onchange = () => {
      const file: File = input.files![0];
      // file type is only image.
      if (/^image\//.test(file.type)) {
        if (file.size > this.maxUploadFileSize) {
          this.messageService.add({
            severity: 'error',
            summary: this.translate.instant('register-shop.filesize.error'),
            detail: this.translate.instant('register-shop.filesize.error.info'),
          });
        } else {
          const reader = new FileReader();
          reader.onload = () => {
            const range = this.quillEditorRef.getSelection();
            const img = '<img src="' + reader.result + '" />';
            this.quillEditorRef.clipboard.dangerouslyPasteHTML(range.index, img);
          };
          reader.readAsDataURL(file);
        }
      } else {
        this.messageService.add({
          severity: 'error',
          summary: this.translate.instant('register-shop.filetype.error'),
          detail: this.translate.instant('register-shop.filetype.error.info'),
        });
      }
    };
    input.click();
  };

  save(): void {
    this.isSaving = true;
    const product = this.createFromForm();
    product.productType = this.shop.productType;
    this.subscribeToSaveResponse(this.productService.create(product));
  }

  private createFromForm(): IProduct {
    const keywords: any[] = this.editForm.get(['keywords'])!.value;
    let keywordString = '';
    if (keywords != null) {
      keywords.forEach(keyword => {
        keywordString = keywordString + '-----' + keyword.value;
      });
    }
    return {
      ...new Product(),
      id: this.editForm.get(['id'])!.value,
      title: this.editForm.get(['title'])!.value,
      keywords: this.editForm.get(['keywords'])!.value,
      description: this.editForm.get(['description'])!.value,
      dateAdded: this.editForm.get(['dateAdded'])!.value ? dayjs(this.editForm.get(['dateAdded'])!.value, DATE_TIME_FORMAT) : undefined,
      dateModified: this.editForm.get(['dateModified'])!.value
        ? dayjs(this.editForm.get(['dateModified'])!.value, DATE_TIME_FORMAT)
        : undefined,
      priceType: this.editForm.get(['priceType'])!.value,
      rentType: this.editForm.get(['rentType'])!.value,
      price: this.editForm.get(['price'])!.value,
      photoContentType: this.editForm.get(['photoContentType'])!.value,
      photo: this.editForm.get(['photo'])!.value,
      photo2ContentType: this.editForm.get(['photo2ContentType'])!.value,
      photo2: this.editForm.get(['photo2'])!.value,
      photo3ContentType: this.editForm.get(['photo3ContentType'])!.value,
      photo3: this.editForm.get(['photo3'])!.value,
      youtube: this.editForm.get(['youtube'])!.value,
      active: this.editForm.get(['active'])!.value,
      stock: this.editForm.get(['stock'])!.value,
      productType: this.shop.productType,
      itemNumber: this.editForm.get(['itemNumber'])!.value,
      status: this.editForm.get(['status'])!.value,
      unit: this.editForm.get(['unit'])!.value,
      amount: this.editForm.get(['amount'])!.value,
      motto: this.editForm.get(['motto'])!.value,
      shop: this.shop,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProduct>>): void {
    result.subscribe(
      p => this.onSaveSuccess(p.body!),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(p: IProduct): void {
    window.scrollTo(0, 0);
    this.generalService.findWidthAuthorities().subscribe(ub => {
      const user = ub.body!;
      this.generalService.findPointsByKey('create_product').subscribe(pi => {
        const points = pi.body!;
        this.generalService.findUserPointAssociationByUsersIdAndPointkey(user.id!, points.key!).subscribe(s => {
          const upa = s.body!;
          const day = dayjs().date();
          let i = 0;
          upa.forEach(element => {
            if (element.date!.date() === day) {
              i++;
            }
          });
          if (i < points.countPerDay!) {
            const iupa = new UserPointAssociation();
            iupa.users = user;
            iupa.points = points;
            iupa.date = dayjs();
            this.userPointAssociationService.create(iupa).subscribe();
            user.points! += points.points!;
            user.loggedIn = true;
            this.generalService.updateUserLoggedInAndPoints(user.id!, user.loggedIn, user.points!).subscribe(t => {
              this.generalService.findWidthAuthorities().subscribe(k => {
                this.pointsDataService.changePoint(k.body!.points!);
              });
            });
          }
        });
      });
    });

    for (let i = 0; i < this.selectedDeliveryTypes.length; i++) {
      const element = this.selectedDeliveryTypes[i];
      const deliveryType: DeliveryType = new DeliveryType();
      let ppt: DeliveryTypes;
      switch (element) {
        case 'PICKUP':
          ppt = DeliveryTypes.PICKUP;
          deliveryType.deliveryType = ppt;
          deliveryType.minimumOrderQuantity = Number(this.minOrderQuantityPickup);
          deliveryType.price = Number(this.pricePickup);
          break;
        case 'DELIVERY':
          ppt = DeliveryTypes.DELIVERY;
          deliveryType.deliveryType = ppt;
          deliveryType.minimumOrderQuantity = Number(this.minOrderQuantityDelivery);
          deliveryType.price = Number(this.priceDelivery);
          deliveryType.pricePerKilometre = Number(this.priceDeliveryKilometre);
          break;
        case 'SHIPPING':
          ppt = DeliveryTypes.SHIPPING;
          deliveryType.deliveryType = ppt;
          deliveryType.minimumOrderQuantity = Number(this.minOrderQuantityShipping);
          deliveryType.price = Number(this.priceShipping);
          break;

        default:
          break;
      }
      deliveryType.product = p;
      this.deliveryTypeService.create(deliveryType).subscribe();
    }

    this.items.forEach(item => {
      const tag = new Tags();
      tag.product = p;
      tag.tag = item.value;
      this.tagsService.create(tag).subscribe(() => {
        this.isSaving = false;
      });
    });
    this.isSaving = false;
    this.success = true;
  }

  protected onSaveError(): void {
    this.isSaving = false;
    this.error = true;
  }

  trackById(index: number, item: SelectableEntity): any {
    return item.id;
  }

  setPriceType(event: any): void {
    const value = event.target.value;
    if (value === PriceType.SELL) {
      this.isRenting = false;
    } else {
      this.isRenting = true;
    }
  }

  checkValue(e: any, typ: string): void {
    if (e.checked) {
      this.selectedDeliveryTypes.push(typ);
    } else {
      const i = this.selectedDeliveryTypes.findIndex(x => x === typ);
      this.selectedDeliveryTypes.splice(i, 1);
    }
  }
}
