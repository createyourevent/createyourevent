import { IEventProductOrder } from 'app/entities/event-product-order/event-product-order.model';
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
import { IProduct, Product } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/service/product.service';
import { ShopService } from 'app/entities/shop/service/shop.service';
import { IShop } from 'app/entities/shop/shop.model';
import { TagsService } from 'app/entities/tags/service/tags.service';
import { Tags } from 'app/entities/tags/tags.model';
import { GeneralService } from 'app/general.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import * as dayjs from 'dayjs';
import { JhiDataUtils, JhiEventManager, JhiFileLoadError, JhiEventWithContent } from 'ng-jhipster';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';

@Component({
  selector: 'jhi-add-product-update',
  templateUrl: './update-product.component.html',
  styleUrls: ['update-product.component.scss'],
  providers: [MessageService],
})
export class UpdateProductComponent implements OnInit {
  isSaving = false;
  // shops: IShop[] = [];
  dateAddedDp: any;
  dateModifiedDp: any;
  isRenting = false;

  items: any[] = [];

  quillEditorRef: any;
  maxUploadFileSize = 500000;

  showDeliveryTypes = true;

  public selectedDeliveryTypes: string[] = [];
  public minOrderQuantityShipping = 0;
  public minOrderQuantityDelivery = 0;
  public minOrderQuantityPickup = 0;
  public priceShipping = 0;
  public priceDelivery = 0;
  public pricePickup = 0;
  public priceDeliveryKilometre = 0;

  editForm = this.fb.group({
    id: [],
    title: [null, [Validators.required]],
    keywords: [],
    description: [null, [Validators.required]],
    dateAdded: [],
    dateModified: [],
    priceType: [],
    rentType: [],
    price: [null, [Validators.required]],
    photo: [null, [Validators.required]],
    photoContentType: [],
    photo2: [],
    photo2ContentType: [],
    photo3: [],
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
  });

  modules = {};

  constructor(
    protected dataUtils: JhiDataUtils,
    protected eventManager: JhiEventManager,
    protected productService: ProductService,
    protected shopService: ShopService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    private fb: UntypedFormBuilder,
    private generalService: GeneralService,
    private tagsService: TagsService,
    private messageService: MessageService,
    private translate: TranslateService,
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
    this.activatedRoute.data.subscribe(({ product }) => {
      this.showDeliveryTypes = this.checkDeliveryCouldChange(product);
      this.generalService.findDeliveryTypeByProductId(product.id).subscribe(res => {
        const pot = res.body!;
        let i = 0;
        pot.forEach(element => {
          i++;
          this.selectedDeliveryTypes.push(element.deliveryType!);
          switch (element.deliveryType) {
            case DeliveryTypes.PICKUP:
              this.minOrderQuantityPickup = element.minimumOrderQuantity!;
              this.pricePickup = element.price!;
              break;
            case DeliveryTypes.DELIVERY:
              this.minOrderQuantityDelivery = element.minimumOrderQuantity!;
              this.priceDelivery = element.price!;
              this.priceDeliveryKilometre = element.pricePerKilometre!;
              break;
            case DeliveryTypes.SHIPPING:
              this.minOrderQuantityShipping = element.minimumOrderQuantity!;
              this.priceShipping = element.price!;
              break;

            default:
              break;
          }
          if (i === pot.length) {
            this.selectedDeliveryTypes = this.selectedDeliveryTypes.splice(0);
          }
        });
      });

      if (product.priceType === PriceType.RENT) {
        this.isRenting = true;
      }
      this.generalService.findProductTags(product.id).subscribe(p => {
        const prod = p.body!;
        prod.forEach(element => {
          this.items.push({ display: element.tag, value: element.tag });
        });
        this.updateForm(product);
        // this.shopService.query().subscribe((res: HttpResponse<IShop[]>) => (this.shops = res.body || []));
      });
    });
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

  updateForm(product: IProduct): void {
    /*
    const keywordString = product.keywords;
    const keywordArray = keywordString?.split('-----');
    const keywords: any[] = [];
    if(keywordArray !== null){
      keywordArray?.forEach(keyword => {
        keywords.push({ display: keyword, value: keyword });
      });
    }
    */
    this.editForm.patchValue({
      id: product.id,
      title: product.title,
      keywords: product.keywords,
      description: product.description,
      dateAdded: product.dateAdded ? product.dateAdded.format(DATE_TIME_FORMAT) : null,
      dateModified: product.dateModified ? product.dateModified.format(DATE_TIME_FORMAT) : null,
      priceType: product.priceType,
      rentType: product.rentType,
      price: product.price,
      photo: product.photo,
      photoContentType: product.photoContentType,
      photo2: product.photo2,
      photo2ContentType: product.photo2ContentType,
      photo3: product.photo3,
      photo3ContentType: product.photo3ContentType,
      youtube: product.youtube,
      active: product.active,
      stock: product.stock,
      productType: product.productType,
      itemNumber: product.itemNumber,
      status: product.status,
      unit: product.unit,
      amount: product.amount,
      shop: product.shop,
      motto: product.motto,
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
    const product = this.createFromForm();
    if (product.id !== undefined) {
      this.subscribeToSaveResponse(this.productService.update(product));
    } else {
      this.subscribeToSaveResponse(this.productService.create(product));
    }
  }

  private createFromForm(): IProduct {
    /*
    const keywords: any[] = this.editForm.get(['keywords'])!.value;
    let keywordString = '';
    if(keywords != null) {
      keywords.forEach(keyword => {
        keywordString = keywordString + '-----' + keyword.value;
      });
    }
    */
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
      productType: this.editForm.get(['productType'])!.value,
      itemNumber: this.editForm.get(['itemNumber'])!.value,
      status: this.editForm.get(['status'])!.value,
      unit: this.editForm.get(['unit'])!.value,
      amount: this.editForm.get(['amount'])!.value,
      motto: this.editForm.get(['motto'])!.value,
      shop: this.editForm.get(['shop'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProduct>>): void {
    result.subscribe(
      p => this.onSaveSuccess(p.body!),
      () => this.onSaveError()
    );
  }

  checkDeliveryCouldChange(p: IProduct): any {
    this.generalService.findEventProductOrdersByProductId(p.id).subscribe(res => {
      const epos: IEventProductOrder[] = res.body;
      epos.forEach((ele: IEventProductOrder) => {
        if (!ele.billed) {
          return false;
        }
      });
    });
  }

  protected onSaveSuccess(p: IProduct): void {
    this.generalService.findDeliveryTypeByProductId(p.id!).subscribe(res => {
      const ppt = res.body;
      if (ppt && ppt.length > 0) {
        this.generalService.deleteDeliveryTypesByProductId(p.id!).subscribe(() => {
          for (let i = 0; i < this.selectedDeliveryTypes.length; i++) {
            const element = this.selectedDeliveryTypes[i];
            const deliveryType: DeliveryType = new DeliveryType();
            let ppt: DeliveryTypes;
            switch (element) {
              case 'PICKUP':
                ppt = DeliveryTypes.PICKUP;
                deliveryType.deliveryType = ppt;
                deliveryType.minimumOrderQuantity = this.minOrderQuantityPickup;
                deliveryType.price = this.pricePickup;
                break;
              case 'DELIVERY':
                ppt = DeliveryTypes.DELIVERY;
                deliveryType.deliveryType = ppt;
                deliveryType.minimumOrderQuantity = this.minOrderQuantityDelivery;
                deliveryType.price = this.priceDelivery;
                deliveryType.pricePerKilometre = this.priceDeliveryKilometre;
                break;
              case 'SHIPPING':
                ppt = DeliveryTypes.SHIPPING;
                deliveryType.deliveryType = ppt;
                deliveryType.minimumOrderQuantity = this.minOrderQuantityShipping;
                deliveryType.price = this.priceShipping;
                break;

              default:
                break;
            }
            deliveryType.product = p;
            this.deliveryTypeService.create(deliveryType).subscribe(() => {
              if (i + 1 === this.selectedDeliveryTypes.length) {
                this.generalService.deleteProductTag(p.id!).subscribe(() => {
                  let j = 0;
                  this.items.forEach(item => {
                    j++;
                    const tag = new Tags();
                    tag.product = p;
                    tag.tag = item.value;
                    this.tagsService.create(tag).subscribe(() => {
                      if (j === this.items.length) {
                        this.isSaving = false;
                        this.previousState();
                      }
                    });
                  });
                });
              }
            });
          }
        });
      } else {
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
          this.deliveryTypeService.create(deliveryType).subscribe(() => {
            if (i + 1 === this.selectedDeliveryTypes.length) {
              this.generalService.deleteProductTag(p.id!).subscribe(() => {
                let j = 0;
                this.items.forEach(item => {
                  j++;
                  const tag = new Tags();
                  tag.product = p;
                  tag.tag = item.value;
                  this.tagsService.create(tag).subscribe(() => {
                    if (j === this.items.length) {
                      this.isSaving = false;
                      this.previousState();
                    }
                  });
                });
              });
            }
          });
        }
      }
    });
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  trackById(index: number, item: IShop): any {
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
}
