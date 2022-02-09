import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';


import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { OrganizationType } from 'app/entities/enumerations/organization-type.model';
import { IOrganization, Organization } from 'app/entities/organization/organization.model';
import { OrganizationService } from 'app/entities/organization/service/organization.service';
import { GeneralService } from 'app/general.service';
import { IRestaurant, Restaurant } from 'app/entities/restaurant/restaurant.model';
import { Hotel, IHotel } from 'app/entities/hotel/hotel.model';
import { Club, IClub } from 'app/entities/club/club.model';
import { HotelService } from 'app/entities/hotel/service/hotel.service';
import { ClubService } from 'app/entities/club/service/club.service';
import { RestaurantService } from 'app/entities/restaurant/service/restaurant.service';
import { TranslateService } from '@ngx-translate/core';
import { ValidateFileSizeService } from 'app/validators/ValidateFileSize.service';
import { ValidatorHttp } from 'app/validators/ValidatorHttp.service';
import { MessageService } from 'primeng/api';
import { ADDRESS_REGEX } from 'app/constants';
import { RentType } from 'app/entities/enumerations/rent-type.model';
import { Building, IBuilding } from 'app/entities/building/building.model';
import { BuildingService } from 'app/entities/building/service/building.service';

@Component({
  selector: 'jhi-edit-organization',
  templateUrl: './edit-organization.component.html',
  styleUrls: ['./edit-organization.component.scss'],
  providers: [MessageService]
})
export class EditOrganizationComponent implements OnInit {

  isSaving = false;
  organizationTypeValues = Object.keys(OrganizationType);
  rentTypeValues = Object.keys(RentType);

  usersSharedCollection: IUser[] = [];
  type: OrganizationType;

  user: IUser;

  formattedaddress = '';

  modules = {};

  quillEditorRef: any;
  maxUploadFileSize = 500000;

  editRestaurantForm = this.fb.group({
    id: [],
    cId: [],
    name: [null, [Validators.required]],
    organizationType: [OrganizationType.RESTAURANT, [Validators.required]],
    menu: [null, [Validators.required]],
    logo: [],
    logoContentType: [],
    active: [],
    activeOwner: [],
    description: [null, [Validators.required]],
    address: [null, [Validators.required,Validators.pattern(ADDRESS_REGEX)]],
    motto: [null, [Validators.required]],
    phone: [null, [Validators.required]],
    webAddress: [null, [Validators.required, this.validatorHttp.checkHttp()]],
    placeNumber: [null, [Validators.required]],
    price: [],
    rentType: [],
    user: [],
  });

  editBuildingForm = this.fb.group({
    id: [],
    cId: [],
    name: [null, [Validators.required]],
    organizationType: [OrganizationType.RESTAURANT, [Validators.required]],
    logo: [],
    logoContentType: [],
    active: [],
    activeOwner: [],
    description: [null, [Validators.required]],
    address: [null, [Validators.required,Validators.pattern(ADDRESS_REGEX)]],
    motto: [null, [Validators.required]],
    phone: [null, [Validators.required]],
    webAddress: [null, [Validators.required, this.validatorHttp.checkHttp()]],
    placeNumber: [null, [Validators.required]],
    price: [],
    rentType: [],
    user: [],
  });

  editHotelForm = this.fb.group({
    id: [],
    cId: [],
    name: [null, [Validators.required]],
    organizationType: [null, [Validators.required]],
    menu: [null, [Validators.required]],
    placesToSleep: [null, [Validators.required]],
    logo: [],
    logoContentType: [],
    active: [],
    activeOwner: [],
    description: [null, [Validators.required]],
    address: [null, [Validators.required, Validators.pattern(ADDRESS_REGEX)]],
    motto: [null, [Validators.required]],
    phone: [null, [Validators.required]],
    webAddress: [null, [Validators.required, this.validatorHttp.checkHttp()]],
    placeNumber: [null, [Validators.required]],
    price: [null, [Validators.required]],
    rentType: [null, [Validators.required]],
    user: [],
  });

  editClubForm = this.fb.group({
    id: [],
    cId: [],
    name: [null, [Validators.required]],
    organizationType: [null, [Validators.required]],
    priceCard: [null, [Validators.required]],
    logo: [],
    logoContentType: [],
    active: [],
    activeOwner: [],
    description: [null, [Validators.required]],
    address: [null, [Validators.required, Validators.pattern(ADDRESS_REGEX)]],
    motto: [null, [Validators.required]],
    phone: [null, [Validators.required]],
    webAddress: [null, [Validators.required, this.validatorHttp.checkHttp()]],
    placeNumber: [null, [Validators.required]],
    price: [],
    rentType: [],
    user: [],
  });

  editForm: FormGroup = this.editRestaurantForm;

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected organizationService: OrganizationService,
    protected userService: UserService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder,
    private generalService: GeneralService,
    private restaurantService: RestaurantService,
    private clubService: ClubService,
    private hotelService: HotelService,
    private buildingService: BuildingService,
    protected router: Router,
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

  getEditorInstance(editorInstance: any): void {
    this.quillEditorRef = editorInstance;
    const toolbar = editorInstance.getModule('toolbar');
    toolbar.addHandler('image', this.imageHandler);
  }

  imageHandler = (image: any, callback: any) => {
    const input = <HTMLInputElement> document.getElementById('fileInputField');
    document.getElementById('fileInputField')!.onchange = () => {
     const file: File = input.files![0];
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

  public addressChange(address: any): void {
    this.formattedaddress = address.formatted_address;
    this.editForm.patchValue({ address: address.formatted_address });
  }

  ngOnInit(): void {
    this.generalService.findWidthAuthorities().subscribe(u => {
      this.user = u.body;
      this.activatedRoute.data.subscribe(({ organization }) => {
        if(organization.organizationType === OrganizationType.RESTAURANT) {
          this.type = OrganizationType.RESTAURANT;
          this.editForm = this.editRestaurantForm;
          this.updateRestaurantForm(organization);

        }
        if(organization.organizationType === OrganizationType.HOTEL) {
          this.type = OrganizationType.HOTEL;
          this.editForm = this.editHotelForm;
          this.updateHotelForm(organization);

        }
        if(organization.organizationType === OrganizationType.CLUB) {
          this.type = OrganizationType.CLUB;
          this.editForm = this.editClubForm;
          this.updateClubForm(organization);

        }
        if(organization.organizationType === OrganizationType.BUILDING) {
          this.type = OrganizationType.BUILDING;
          this.editForm = this.editBuildingForm;
          this.updateBuildingForm(organization);

        }

        this.loadRelationshipsOptions();
      });
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    let fg: FormGroup;
    if(this.type === OrganizationType.RESTAURANT) {
      fg = this.editRestaurantForm;
    }
    else if(this.type === OrganizationType.HOTEL) {
      fg = this.editHotelForm;
    }
    else if(this.type === OrganizationType.CLUB) {
      fg = this.editClubForm;
    }

    this.dataUtils.loadFileToForm(event, fg, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('createyoureventApp.error', { ...err, key: 'error.file.' + err.key })),
    });
  }

  clearInputImage(field: string, fieldContentType: string, idInput: string): void {
    let fg: FormGroup;
    if(this.type === OrganizationType.RESTAURANT) {
      fg = this.editRestaurantForm;
    }
    else if(this.type === OrganizationType.HOTEL) {
      fg = this.editHotelForm;
    }
    else if(this.type === OrganizationType.CLUB) {
      fg = this.editClubForm;
    }
    else if(this.type === OrganizationType.BUILDING) {
      fg = this.editBuildingForm;
    }


    fg.patchValue({
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

    if(this.type === OrganizationType.RESTAURANT) {
      let organization: IRestaurant;
      organization = this.createFromRestaurantForm();
      this.subscribeToSaveResponseRestaurant(this.restaurantService.update(organization));
    }
    else if(this.type === OrganizationType.HOTEL) {
      let organization: IHotel;
      organization = this.createFromHotelForm();
      this.subscribeToSaveResponseHotel(this.hotelService.update(organization));
    }
    else if(this.type === OrganizationType.CLUB) {
      let organization: IClub;
      organization = this.createFromClubForm();
      this.subscribeToSaveResponseClub(this.clubService.update(organization));
    }
    else if(this.type === OrganizationType.BUILDING) {
      let organization: IBuilding;
      organization = this.createFromBuildingForm();
      this.subscribeToSaveResponseBuilding(this.buildingService.update(organization));
    }
  }

  trackUserById(index: number, item: IUser): string {
    return item.id!;
  }

  protected subscribeToSaveResponseRestaurant(result: Observable<HttpResponse<IRestaurant>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected subscribeToSaveResponseHotel(result: Observable<HttpResponse<IHotel>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected subscribeToSaveResponseClub(result: Observable<HttpResponse<IClub>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected subscribeToSaveResponseBuilding(result: Observable<HttpResponse<IBuilding>>): void {
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

  changeType(e: any): void{
    this.type = e.target.value;
    if(this.type === OrganizationType.RESTAURANT) {
      this.editRestaurantForm.get('organizationType').setValue(OrganizationType.RESTAURANT);
      this.editForm = this.editRestaurantForm;
    }
    else if(this.type === OrganizationType.HOTEL) {
      this.editHotelForm.get('organizationType').setValue(OrganizationType.HOTEL);
      this.editForm = this.editHotelForm;
    }
    else if(this.type === OrganizationType.CLUB) {
      this.editClubForm.get('organizationType').setValue(OrganizationType.CLUB);
      this.editForm = this.editClubForm;
    }
    else if(this.type === OrganizationType.BUILDING) {
      this.editClubForm.get('organizationType').setValue(OrganizationType.BUILDING);
      this.editForm = this.editBuildingForm;
    }
  }

  protected updateRestaurantForm(restaurant: IOrganization): void {
    this.editRestaurantForm.patchValue({
      id: restaurant.id,
      cId: restaurant.restaurant.id,
      name: restaurant.name,
      organizationType: restaurant.organizationType,
      menu: restaurant.restaurant.menu,
      logo: restaurant.logo,
      logoContentType: restaurant.logoContentType,
      active: restaurant.active,
      activeOwner: restaurant.activeOwner,
      description: restaurant.description,
      address: restaurant.address,
      motto: restaurant.motto,
      phone: restaurant.phone,
      webAddress: restaurant.webAddress,
      placeNumber: restaurant.placeNumber,
      price: restaurant.price,
      rentType: restaurant.rentType,
      user: this.user,
    });

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, restaurant.user);
  }

  protected updateBuildingForm(building: IOrganization): void {
    this.editBuildingForm.patchValue({
      id: building.id,
      cId: building.building.id,
      name: building.name,
      organizationType: building.organizationType,
      logo: building.logo,
      logoContentType: building.logoContentType,
      active: building.active,
      activeOwner: building.activeOwner,
      description: building.description,
      address: building.address,
      motto: building.motto,
      phone: building.phone,
      webAddress: building.webAddress,
      placeNumber: building.placeNumber,
      price: building.price,
      rentType: building.rentType,
      user: this.user,
    });
  }

  protected updateHotelForm(hotel: IOrganization): void {
    this.editRestaurantForm.patchValue({
      id: hotel.id,
      cId: hotel.hotel.id,
      name: hotel.name,
      organizationType: hotel.organizationType,
      menu: hotel.hotel.menu,
      placesToSleep: hotel.hotel.placesToSleep,
      logo: hotel.logo,
      logoContentType: hotel.logoContentType,
      active: hotel.active,
      activeOwner: hotel.activeOwner,
      description: hotel.description,
      address: hotel.address,
      motto: hotel.motto,
      phone: hotel.phone,
      webAddress: hotel.webAddress,
      placeNumber: hotel.placeNumber,
      price: hotel.price,
      rentType: hotel.rentType,
      user: this.user,
    });

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, hotel.user);
  }

  protected updateClubForm(club: IOrganization): void {
    this.editClubForm.patchValue({
      id: club.id,
      cId: club.club.id,
      name: club.name,
      organizationType: club.organizationType,
      priceCard: club.club.priceCard,
      logo: club.logo,
      logoContentType: club.logoContentType,
      active: club.active,
      activeOwner: club.activeOwner,
      description: club.description,
      address: club.address,
      motto: club.motto,
      phone: club.phone,
      webAddress: club.webAddress,
      placeNumber: club.placeNumber,
      price: club.price,
      rentType: club.rentType,
      user: this.user,
    });

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, club.user);
  }


  protected loadRelationshipsOptions(): void {

    let fg: FormGroup;
    if(this.type === OrganizationType.RESTAURANT) {
      fg = this.editRestaurantForm;
    }
    else if(this.type === OrganizationType.HOTEL) {
      fg = this.editHotelForm;
    }
    else if(this.type === OrganizationType.CLUB) {
      fg = this.editClubForm;
    }

    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, fg.get('user')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }

  protected createFromRestaurantForm(): any{
    const o = new Organization();
    o.id =  this.editForm.get(['id'])!.value;
    o.name = this.editForm.get(['name'])!.value;
    o.organizationType = this.editForm.get(['organizationType'])!.value;
    o.logoContentType = this.editForm.get(['logoContentType'])!.value;
    o.logo = this.editForm.get(['logo'])!.value;
    o.active = this.editForm.get(['active'])!.value;
    o.activeOwner = this.editForm.get(['activeOwner'])!.value;
    o.description = this.editForm.get(['description'])!.value;
    o.address = this.editForm.get(['address'])!.value;
    o.motto = this.editForm.get(['motto'])!.value,
    o.phone = this.editForm.get(['phone'])!.value,
    o.webAddress = this.editForm.get(['webAddress'])!.value,
    o.placeNumber = this.editForm.get(['placeNumber'])!.value,
    o.price = this.editForm.get(['price'])!.value,
    o.rentType = this.editForm.get(['rentType'])!.value,
    o.user = this.user;

      const r = new Restaurant();
      r.id = this.editForm.get(['cId'])!.value;
      r.menu = this.editForm.get(['menu'])!.value;
      r.organization = o;
      r.user = this.user;
    return r;
  }

  protected createFromBuildingForm(): any{
    const o = new Organization();
    o.id =  this.editForm.get(['id'])!.value;
    o.name = this.editForm.get(['name'])!.value;
    o.organizationType = this.editForm.get(['organizationType'])!.value;
    o.logoContentType = this.editForm.get(['logoContentType'])!.value;
    o.logo = this.editForm.get(['logo'])!.value;
    o.active = this.editForm.get(['active'])!.value;
    o.activeOwner = this.editForm.get(['activeOwner'])!.value;
    o.description = this.editForm.get(['description'])!.value;
    o.address = this.editForm.get(['address'])!.value;
    o.motto = this.editForm.get(['motto'])!.value,
    o.phone = this.editForm.get(['phone'])!.value,
    o.webAddress = this.editForm.get(['webAddress'])!.value,
    o.placeNumber = this.editForm.get(['placeNumber'])!.value,
    o.price = this.editForm.get(['price'])!.value,
    o.rentType = this.editForm.get(['rentType'])!.value,
    o.user = this.user;

      const r = new Building();
      r.id = this.editForm.get(['cId'])!.value;
      r.organization = o;
      return r;

  }

  protected createFromHotelForm(): any {
    const o = new Organization();
    o.id =  this.editForm.get(['id'])!.value;
    o.name = this.editForm.get(['name'])!.value;
    o.organizationType = this.editForm.get(['organizationType'])!.value;
    o.logoContentType = this.editForm.get(['logoContentType'])!.value;
    o.logo = this.editForm.get(['logo'])!.value;
    o.active = this.editForm.get(['active'])!.value;
    o.activeOwner = this.editForm.get(['activeOwner'])!.value;
    o.description = this.editForm.get(['description'])!.value;
    o.address = this.editForm.get(['address'])!.value;
    o.motto = this.editForm.get(['motto'])!.value,
    o.phone = this.editForm.get(['phone'])!.value,
    o.webAddress = this.editForm.get(['webAddress'])!.value,
    o.placeNumber = this.editForm.get(['placeNumber'])!.value,
    o.price = this.editForm.get(['price'])!.value,
    o.rentType = this.editForm.get(['rentType'])!.value,
    o.user = this.user;

    const r = new Hotel();
    r.id = this.editForm.get(['cId'])!.value;
    r.menu = this.editForm.get(['menu'])!.value;
    r.placesToSleep = this.editForm.get(['placesToSleep'])!.value;
    r.organization = o;
    r.user = this.user;
    return r;

  }

  protected createFromClubForm(): any{
    const o = new Organization();
    o.id =  this.editForm.get(['id'])!.value;
    o.name = this.editForm.get(['name'])!.value;
    o.organizationType = this.editForm.get(['organizationType'])!.value;
    o.logoContentType = this.editForm.get(['logoContentType'])!.value;
    o.logo = this.editForm.get(['logo'])!.value;
    o.active = this.editForm.get(['active'])!.value;
    o.activeOwner = this.editForm.get(['activeOwner'])!.value;
    o.description = this.editForm.get(['description'])!.value;
    o.address = this.editForm.get(['address'])!.value;
    o.motto = this.editForm.get(['motto'])!.value,
    o.phone = this.editForm.get(['phone'])!.value,
    o.webAddress = this.editForm.get(['webAddress'])!.value,
    o.placeNumber = this.editForm.get(['placeNumber'])!.value,
    o.price = this.editForm.get(['price'])!.value,
    o.rentType = this.editForm.get(['rentType'])!.value,
    o.user = this.user;

    const r = new Club();
    r.id = this.editForm.get(['cId'])!.value;
    r.priceCard= this.editForm.get(['priceCard'])!.value;
    r.organization = o;
    r.user = this.user;
    return r;

  }

}
