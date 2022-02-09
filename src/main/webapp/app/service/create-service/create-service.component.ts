import { HttpResponse } from "@angular/common/http";
import { Component, OnInit, ElementRef, ChangeDetectorRef } from "@angular/core";
import { Validators, FormBuilder } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { ADDRESS_REGEX } from "app/constants";
import { ICreateYourEventService, CreateYourEventService } from "app/entities/create-your-event-service/create-your-event-service.model";
import { CreateYourEventServiceService } from "app/entities/create-your-event-service/service/create-your-event-service.service";
import { TagsService } from "app/entities/tags/service/tags.service";
import { Tags } from "app/entities/tags/tags.model";
import { UserPointAssociationService } from "app/entities/user-point-association/service/user-point-association.service";
import { UserPointAssociation } from "app/entities/user-point-association/user-point-association.model";
import { IUser } from "app/entities/user/user.model";
import { GeneralService } from "app/general.service";
import { PointsDataService } from "app/points/points-display/points-display.service";
import { AlertError } from "app/shared/alert/alert-error.model";
import { ValidateFileSizeService } from "app/validators/ValidateFileSize.service";
import { ValidatorHttp } from "app/validators/ValidatorHttp.service";
import * as dayjs from "dayjs";
import { JhiDataUtils, JhiEventManager, JhiFileLoadError, JhiEventWithContent } from "ng-jhipster";
import { MessageService } from "primeng/api";
import { Observable } from "rxjs";


@Component({
  selector: 'jhi-create-service',
  templateUrl: './create-service.component.html',
  styleUrls: ['create-service.component.scss'],
  providers: [MessageService]
})
export class CreateServiceComponent implements OnInit {
  error = false;
  success = false;

  isSaving = false;
  formattedaddress = '';
  usr: IUser;

  quillEditorRef: any;
  maxUploadFileSize = 500000;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    logo: [null, [this.validateFileSizeService.valFileSize(256000)]],
    logoContentType: [],
    active: [],
    description: [null, [Validators.required]],
    address: [
      null,
      [
        Validators.required,
        Validators.pattern(ADDRESS_REGEX)
      ]
    ],
    motto: [null, [Validators.required]],
    phone: [null, [Validators.required]],
    webAddress: [null, [this.validatorHttp.checkHttp()]],
    category: [null, [Validators.required]],
    user: []
  });

  items: any[] = [];

  modules = {};

  constructor(
    protected dataUtils: JhiDataUtils,
    protected eventManager: JhiEventManager,
    protected createYourEventServiceService: CreateYourEventServiceService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private generalService: GeneralService,
    private tagsService: TagsService,
    private ref: ChangeDetectorRef,
    private pointsDataService: PointsDataService,
    private userPointAssociationService: UserPointAssociationService,
    private validateFileSizeService: ValidateFileSizeService,
    private messageService: MessageService,
    private translate: TranslateService,
    private validatorHttp: ValidatorHttp
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

        ['link', 'image', 'video'] // link and image, video
      ]
    };
  }

  ngOnInit(): void {
    this.generalService.findWidthAuthorities().subscribe(u => {
      this.usr = u.body;
    });
  }

  getEditorInstance(editorInstance: any): void {
    this.quillEditorRef = editorInstance;
    const toolbar = editorInstance.getModule('toolbar');
    toolbar.addHandler('image', this.imageHandler);
  }

   imageHandler = (image: any, callback: any) => {
     const input = <HTMLInputElement> document.getElementById('fileInputField');
     document.getElementById('fileInputField').onchange = () => {
       const file: File = input.files[0];
       // file type is only image.
       if (/^image\//.test(file.type)) {
         if (file.size > this.maxUploadFileSize) {
          this.messageService.add({severity:'error', summary: this.translate.instant('register-shop.filesize.error'), detail: this.translate.instant('register-shop.filesize.error.info')});
         } else {
           const reader  = new FileReader();
           reader.onload = () =>  {
             const range = this.quillEditorRef.getSelection();
             const img = '<img src="' + reader.result + '" />';
             this.quillEditorRef.clipboard.dangerouslyPasteHTML(range.index, img);
           };
           reader.readAsDataURL(file);
         }
       } else {
          this.messageService.add({severity:'error', summary: this.translate.instant('register-shop.filetype.error'), detail: this.translate.instant('register-shop.filetype.error.info')});
       }
     };
     input.click();
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

  /*

  save(): void {
    this.isSaving = true;
    const createYourEventService = this.createFromForm();
    if (createYourEventService.id !== undefined) {
      this.subscribeToSaveResponse(this.createYourEventServiceService.update(createYourEventService));
    } else {
      this.subscribeToSaveResponse(this.createYourEventServiceService.create(createYourEventService));
    }
  }
*/

  save(): void {
    this.isSaving = true;
    const createYourEventService = this.createFromForm();
    this.subscribeToSaveResponse(this.createYourEventServiceService.create(createYourEventService));
  }

  private createFromForm(): ICreateYourEventService {
    return {
      ...new CreateYourEventService(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      logoContentType: this.editForm.get(['logoContentType'])!.value,
      logo: this.editForm.get(['logo'])!.value,
      active: this.editForm.get(['active'])!.value,
      description: this.editForm.get(['description'])!.value,
      address: this.editForm.get(['address'])!.value,
      motto: this.editForm.get(['motto'])!.value,
      phone: this.editForm.get(['phone'])!.value,
      webAddress: this.editForm.get(['webAddress'])!.value,
      category: this.editForm.get(['category'])!.value,
      user: this.usr
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICreateYourEventService>>): void {
    result.subscribe(
      s => this.onSaveSuccess(s.body),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(s: ICreateYourEventService): void {
    window.scrollTo(0,0);
    this.generalService.findWidthAuthorities().subscribe(ub => {
      const user = ub.body;
      this.generalService.findPointsByKey('create_service').subscribe(p => {
        const points = p.body;
        this.generalService.findUserPointAssociationByUsersIdAndPointkey(user.id, points.key).subscribe(si => {
          const upa = si.body;
          const day = dayjs().date();
          let i = 0;
          upa.forEach(element => {
            if (dayjs(element.date).date() === day) {
              i++;
            }
          });
          if (i < points.countPerDay) {
            const iupa = new UserPointAssociation();
            iupa.users = user;
            iupa.points = points;
            iupa.date = dayjs();
            this.userPointAssociationService.create(iupa).subscribe();
            user.points += points.points;
            user.loggedIn = true;
            this.generalService.updateUserLoggedInAndPoints(user.id, user.loggedIn, user.points).subscribe(t => {
              this.generalService.findWidthAuthorities().subscribe(k => {
                this.pointsDataService.changePoint(k.body.points);
              });
            });
          }
        });
      });
    });

    this.items.forEach(item => {
      const tag = new Tags();
      tag.tag = item.value;
      tag.service = s;
      this.tagsService.create(tag).subscribe(() => {
        this.isSaving = false;
        this.success = true;
        window.scrollTo(0, 0);
      });
    });
  }

  protected onSaveError(): void {
    this.isSaving = false;
    this.error = true;
  }

  public addressChange(address: any): void {
    this.formattedaddress = address.formatted_address;
    this.editForm.patchValue({ address: address.formatted_address });
  }
}
